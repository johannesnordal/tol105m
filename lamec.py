#!/usr/bin/env python3

import sys
import json
import os
import re
import update
import http.client

scriptpath = f'{sys.path[0]}/scripts'

def report(system, software, passed):
    server = 'localhost:5000'
    endpoint = '/data/status.json'

    data = {
        'system': system,
        'software': software,
        'passed': passed
    }

    json_data = json.dumps(data)

    conn = http.client.HTTPConnection(server)

    headers = {
        'Content-type': 'application/json',
        'Content-length': str(len(json_data))
    }

    conn.request('POST', endpoint, body=json_data, headers=headers)
    response = conn.getresponse()
    response_data = response.read()
    print(response_data)

    conn.close()

class Module:
    """
    Global variables
    """
    BEGIN = '#MODULES BEGIN '
    END = '#MODULES END'

def new_module_commands():
    return {'purge': set(), 'use': set(), 'modules': list()}

def parse_module_commands(args, module_commands):

    def is_module_keyword(token: str):
        return token == 'module' or token == 'ml'

    lines = args['startscript'].splitlines()
    for line in lines:
        tokens = line.split()
        if len(tokens) != 0 and is_module_keyword(tokens[0]):
            if 'purge' in tokens:
                module_commands['purge'].add(line.strip())
            elif 'use' in tokens:
                module_commands['use'].add(line.strip())
            else:
                for t in tokens:
                    if not is_module_keyword(t):
                        if t not in module_commands['modules']:
                            module_commands['modules'].append(t)

def generate_module_statements(args):
    module_commands = new_module_commands()

    parse_module_commands(args, module_commands)

    module_statements = ''
    for purge in module_commands['purge']:
        module_statements += (purge + '\n')

    for use in module_commands['use']:
        module_statements += (use + '\n')

    module_statements += 'ml'
    for module in module_commands['modules']:
        module_statements += (' ' + module)
    module_statements += '\n'

    return module_statements

def generate_module_block(args):
    module_block = Module.BEGIN
    module_block += (args['system'] + ' ' + args['software'] + '\n')
    module_block += generate_module_statements(args)
    module_block += (Module.END + '\n\n')
    return module_block

def generate_param_block(args):    
    if args['system'] == 'jureca':
        partition = 'dc-gpu'
        gpus_pernode = 4
    elif args['system'] == 'juwels':
        partition = 'dc-gpu'
        gpus_pernode = 4
    elif args['system'] == 'deep':
        partition = 'dc-gpu'
        gpus_pernode = 1
    else:
        partition = ''
        gpus_pernode = 1
        
    if args['software'] == 'ddp':
        ntask_pernode = 1
    else:
        ntask_pernode = gpus_pernode
        
    param_block = '#!/bin/bash\n'
    param_block += ('#SBATCH --job-name=job\n'
            + '#SBATCH --output=job.out\n'
            + '#SBATCH --error=job.err\n')
    param_block += '#SBATCH --account=' + str(args['account']) + '\n'
    param_block += '#SBATCH --partition=' + partition + '\n'
    param_block += '#SBATCH --nodes=' + str(args['nodes']) + '\n'
    param_block += '#SBATCH --gpus-per-node=' + str(gpus_pernode) + '\n'
    param_block += '#SBATCH --ntasks-per-node=' + str(ntask_pernode) + '\n'
    param_block += '#SBATCH --cpus-per-task=1' + '\n'
    param_block += '#SBATCH --exclusive' + '\n'
    param_block += '#SBATCH --gres=gpu:' + str(gpus_pernode) + '\n\n'
    
    return param_block
    
def generate_env_block(args):
    #environment variable, export 1.CUDA_VISIBLE_DEVICES
    #source python venv
    env_block = ''
    lines = args['startscript'].splitlines()
    for line in lines:
        tokens = line.split()
        if (len(tokens) > 1  and tokens[0] == 'export'
                and 'CUDA_VISIBLE_DEVICES' in tokens[1]):
            env_block += line.strip()
    
    env_block += '\n'
    if args['system'] == 'jureca' and args['software'] == 'ddp':
        env_block += 'source your/env_path/bin/activate\n'
    elif args['system'] == 'deep' and args['software'] == 'ddp':
        env_block += 'source your/env_path/bin/activate\n'
    elif args['system'] == 'juwels':
        env_block += 'source your/env_path/bin/activate\n'    
    else:
        env_block += 'source your/env_path/bin/activate\n'
        
    return env_block
    
def generate_launch_block(args):
    launch_block = '\n'
    def keyword_exist(tokens=list()):
        keywords=['srun','nnodes','nproc_per_node','rdzv']
        result = False
        for kw in keywords:
            result = True in (kw in item for item in tokens)
            if result == True:
                break

        return result
        
    if args['software'] == 'ddp':
        lines = args['startscript'].splitlines()        
        for line in lines:
            tokens = line.split()
            if len(tokens)!=0 and '#' not in tokens[0] and keyword_exist(tokens):
                launch_block +=line + '\n'
    launch_block += (args['executable'] +'"')
    launch_block += '\n'
    return launch_block

def parse(args):
    param_block = generate_param_block(args)
    module_block = generate_module_block(args)
    env_block = generate_env_block(args)
    launch_block = generate_launch_block(args)
    outp = param_block + module_block + env_block + launch_block
    print(outp, end='')

def get_placeholders(template):
    placeholders = []
    pattern = re.compile(r'%.[a-zA-Z0-9_:-]+%')
    for x in re.findall(pattern, template):
        p = x.replace('%', '')
        if p not in placeholders:
            placeholders.append(p)
    return placeholders

def get_template(system, software):
    # TODO: error handling
    dirpath = f'{scriptpath}/{system}/{software}'
    with open(f'{dirpath}/lamec.json', 'r') as f:
        info = json.load(f)
    if 'template' not in info:
        return False
    template_path = f'{dirpath}/{info["template"]}'
    with open(template_path, 'r') as f:
        return f.read()

def expand(template, args):
    for key in args:
        template = template.replace(f'%{key}%', args[key])
    return template

def main():
    if len(sys.argv) == 1:
        args = json.load(sys.stdin)
    else:
        if len(sys.argv) > 1 and sys.argv[1] == 'build':
            update.update_all()
            return
        else:
            args = json.loads(sys.argv[1])

    path = os.path.join(scriptpath, f"{args['system']}/{args['software']}")
    with open(os.path.join(path, 'lamec.json'), 'r') as f:
        config = json.load(f)
        if 'startscript' in config:
            with open(os.path.join(path, config['startscript']), 'r') as f:
                args['startscript'] = f.read()
            parse(args)
        elif 'template' in config:
            template = get_template(args['system'], args['software'])
            print(expand(template, args), end='')

if __name__ == '__main__':
    main()
