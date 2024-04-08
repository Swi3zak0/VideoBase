from jinja2 import Environment, PackageLoader


def environment(**options):
    env = Environment(**options)
    env.loader = PackageLoader('app', '../VideoBase/templates')
    return env
