class CommandHandler {
    static getCommandByDistro(distro) {
        const commands = {
            'ubuntu': 'sudo apt-get install -y',
            'debian': 'sudo apt-get install -y',
            'fedora': 'sudo dnf install -y',
            'centos': 'sudo yum install -y',
            'arch': 'sudo pacman -Syu --noconfirm',
            'suse': 'sudo zypper install -y',
            'win32': 'choco install -y',
            'darwin': 'brew install',
            'android': 'pkg install'
          }
          
  
      if (!commands[distro]) {
        return { data: undefined, error: 'Distro not registered, change CMD in your config file' };
      }
      return { data: commands[distro], error: undefined };
    }
}
  
export default CommandHandler;