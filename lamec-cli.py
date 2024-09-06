#!/usr/bin/env python3

import http.client
import json
import argparse
import sys

url = 'localhost:5000'

def get_form_schema():
    endpoint = '/data/form-schema.json'
    conn = http.client.HTTPConnection(url)
    headers = {
        'Content-type': 'application/json'
    }
    conn.request('GET', endpoint, headers=headers)
    response = conn.getresponse()
    data = json.loads(response.read())
    conn.close()
    return data

def get_system_desc(data):
    for field in data['fields']:
        if field['name'] == 'system':
            return field['desc']

def get_systems(data):
    for field in data['fields']:
        if field['name'] == 'system':
            return field['restriction']['value']

def add_system_parsers(parser, data):
    subparsers = parser.add_subparsers(
        dest='system',
        title='list of available systems',
        metavar='SYSTEM',
        help=get_system_desc(data),
    )
    system_parsers = {}
    for name in get_systems(data):
        system_parsers[name] = subparsers.add_parser(
            name,
            help='',
        )
    return system_parsers

def get_software_desc(data):
    for field in data['fields']:
        if field['name'] == 'software':
            return field['desc']

def add_software_parser():
    pass

class CustomArgumentDefaultsHelpFormatter(argparse.ArgumentDefaultsHelpFormatter):
    def _get_help_string(self, action):
        help_str = action.help
        if '%(default)' not in action.help:
            if action.default is not None and action.default != argparse.SUPPRESS:
                help_str += ' (default: %(default)s)'
        return help_str

def add_software_parsers(parser, system, data):
    subparsers = parser.add_subparsers(
        dest=f'software',
        title='list of available software',
        metavar='SOFTWARE',
        description=get_software_desc(data),
        help=''
    )
    res = None
    for field in data['fields']:
        if field['name'] == 'software':
            res = field['restriction']['value']['depends_on']['resolution']
    software = []
    for entry in res:
        if system in entry['key']:
            software = entry['value']
    for name in software:
        subparser = subparsers.add_parser(
            name,
            help='',
            formatter_class=CustomArgumentDefaultsHelpFormatter,
        )
        '''
        subparser.add_argument(
            '--output',
            metavar='',
            help='Write to FILE instead of stdout'
        )
        '''
        group = subparser.add_argument_group(title='configuration')
        for field in data['fields']:
            if field['name'] != 'system' and field['name'] != 'software':
                include = True
                if 'scope' in field:
                    found = False
                    for value in field['scope'][0]['values']:
                        if system in value and name in value:
                            found = True
                            break
                    if not found:
                        include = False
                if include:
                    arg = {
                        'metavar': '\b',
                        'help': field['desc']
                    }
                    if 'default' not in field:
                        arg['required'] = True
                    else:
                        arg['default'] = field['default']
                    group.add_argument(
                        f'--{field["name"]}',
                        **arg,
                    )

def post_request(data):
    server = 'localhost:5000'
    endpoint = '/data.php'

    json_data = json.dumps(data)

    conn = http.client.HTTPConnection(server)

    headers = {
        'Content-type': 'application/json',
        'Content-length': str(len(json_data)),
    }

    conn.request('POST', endpoint, body=json_data, headers=headers)
    response = conn.getresponse()
    response_data = response.read()
    conn.close()
    return response_data

def main():
    parser = argparse.ArgumentParser(prog=sys.argv[0])
    data = get_form_schema()
    system_parsers = add_system_parsers(parser, data)
    for name in system_parsers:
        add_software_parsers(system_parsers[name], name, data)
    args = parser.parse_args()
    if not args.system:
        parser.print_help()
        sys.exit(1)
    else:
        if not vars(args)[f'software']:
            system_parsers[args.system].print_help()
            sys.exit(1)

    print(post_request(vars(args)).decode('ascii'), end='')

if __name__ == '__main__':
    main()
