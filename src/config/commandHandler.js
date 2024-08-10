class CommandHandler {
    static getCommandByDistro(distro) {
      const commands = {
        'ubuntu': 'sudo -S apt-get',
        'debian': 'sudo -S apt-get',
        'fedora': 'sudo -S dnf',
        'centos': 'sudo -S yum',
        'arch': 'sudo -S pacman',
        'suse': 'zypper',
        'win32': 'choco',
        'darwin': 'brew',
        'android': 'pkg'
      };
  
      if (!commands[distro]) {
        return { data: undefined, error: 'Distro not registered, change CMD in your config file' };
      }
      return { data: commands[distro], error: undefined };
    }
}
  
export default CommandHandler;