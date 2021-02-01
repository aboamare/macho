module.exports = {
  apps : [{
    script: 'server.js',
    watch: false,
    log_file: 'macho.log',
    time: true,
    env: {
      NODE_ENV: "development"
    },
    env_production: {
      NODE_ENV: "production"
    }
  }],

  deploy : {
    production : {
      key  : '/Users/robaar/.ssh/ab_rsa',
      user : 'pi',
      host : '192.168.43.27',
      ref  : 'origin/master',
      repo : 'https://github.com/aboamare/macho.git',
      path : '/home/pi/Macho',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
