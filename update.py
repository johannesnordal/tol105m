import lamec
import sys
import os
import json

def get_defs():
    with open(f'{lamec.scriptpath}/info.json', 'r') as f:
        info = json.load(f)
    return info['defs']

def get_docs():
    with open(f'{lamec.scriptpath}/info.json', 'r') as f:
        info = json.load(f)
    return info['docs']

def get_system(vardef):
    builder = VarBuilder('system', vardef['type'], vardef['desc'])
    for system in os.scandir(lamec.scriptpath):
        if system.name.startswith('.') or os.path.isdir(system) == False:
            continue
        builder.add(system.name)
    builder.values.sort()
    return builder.build()

def get_software(vardef):
    builder = VarBuilder('software',
            vardef['type'],
            vardef['desc'],
            depends_on=vardef['depends_on'])
    software = []
    for system in os.scandir(lamec.scriptpath):
        if system.name.startswith('.') or os.path.isdir(system) == False:
            continue
        value = []
        for software in os.scandir(f'{lamec.scriptpath}/{system.name}'):
            if software.name.startswith('.') or os.path.isdir(software) == False:
                continue
            value.append(software.name)
        builder.add(value, resolve_on=[system.name])
    return builder.build()

def get_partition(vardef):
    builder = VarBuilder('partition',
            vardef['type'],
            vardef['desc'],
            depends_on=vardef['depends_on'])
    for system in os.scandir(lamec.scriptpath):
        if system.name.startswith('.') or os.path.isdir(system) == False:
            continue
        value = []
        sysinfo = get_sysinfo(system.name)
        for partition in sysinfo['partition']:
            value.append(partition)
        builder.add(value, resolve_on=[system.name])
    return builder.build()

def get_nodes(vardef):
    builder = VarBuilder('nodes',
            vardef['type'],
            vardef['desc'],
            depends_on=vardef['depends_on'])
    for system in os.scandir(lamec.scriptpath):
        if system.name.startswith('.') or os.path.isdir(system) == False:
            continue
        sysinfo = get_sysinfo(system.name)
        for partition in sysinfo['partition']:
            value = [1, sysinfo['partition'][partition]['nodes']]
            builder.add(value, resolve_on=[system.name, partition])
    return builder.build()

def get_sysinfo(system):
    with open(f'{lamec.scriptpath}/{system}/sysinfo.json', 'r') as f:
        sysinfo = json.load(f)
    return sysinfo


class VarBuilder:
    def __init__(self, name, typename, desc, default=None, depends_on=[]):
        self.name = name
        self.typename = typename
        self.desc = desc
        self.default = default
        self.depends_on = depends_on
        self.values = []

    def add(self, value, resolve_on=[]):
        if len(resolve_on) != 0:
            self.values.append({'key': resolve_on, 'value': value})
        else:
            self.values.append(value)

    def build(self):
        d = dict()
        d['name'] = self.name
        d['desc'] = self.desc
        if self.typename == 'option' or self.typename == 'range':
            if self.typename == 'option':
                d['type'] = 'string'
            else:
                d['type'] = 'number'
            d['restriction'] = dict()
            d['restriction']['type'] = self.typename
            d['restriction']['value'] = dict()
            if len(self.depends_on):
                d['restriction']['value']['depends_on'] = dict()
                d['restriction']['value']['depends_on']['fields'] = self.depends_on
                d['restriction']['value']['depends_on']['resolution'] = []
                for value in self.values:
                    d['restriction']['value']['depends_on']['resolution'].append(value)
            else:
                d['restriction']['value'] = self.values
        else:
            d['type'] = self.typename
        if self.default:
            d['default'] = self.default
        return d

def get_free_variable(name, defs):
    vardef = defs[name]
    default = None
    if 'default' in vardef:
        default = vardef['default']
    builder = VarBuilder(name,
            vardef['type'],
            vardef['desc'],
            default)
    return builder.build()

def set_scope(fields):
    scope = dict()
    for system in os.scandir(lamec.scriptpath):
        if system.name.startswith('.') or os.path.isdir(system) == False:
            continue
        for software in os.scandir(f'{lamec.scriptpath}/{system.name}'):
            if software.name.startswith('.') or os.path.isdir(software) == False:
                continue
            template = lamec.get_template(system.name, software.name)
            if template:
                variables = lamec.get_placeholders(template)
                for var in variables:
                    if var not in scope:
                        scope[var] = []
                    scope[var].append([system.name, software.name])
    for key in scope:
        for field in fields:
            if field['name'] == key and 'restriction' not in field:
                if 'scope' not in field:
                    field['scope'] = []
                field['scope'].append({'fields': ['system', 'software'],
                        'values': scope[key]})
    '''
    for field in fields:
        if field['name'] not in ['system', 'software'] and 'scope' not in field:
            field['scope'] = []
    '''

def update_all():
    fields = []
    with open(f'{lamec.scriptpath}/info.json', 'r') as f:
        info = json.load(f)
        defs = info['defs']
    dependent_variables = ['system', 'software', 'partition', 'nodes']
    callbacks = {
            'system': get_system,
            'software': get_software,
            'partition': get_partition,
            'nodes': get_nodes}
    for var in dependent_variables:
        fields.append(callbacks[var](defs[var]))
    for var in defs:
        if var not in dependent_variables:
            fields.append(get_free_variable(var, defs))
    form_schema = {'fields': fields, 'documentation': info['docs']}
    set_scope(fields)
    with open('data/form-schema.json', 'w') as out:
        json.dump(form_schema, out, indent=4)

def main():
    update_all()

if __name__ == '__main__':
    main()
