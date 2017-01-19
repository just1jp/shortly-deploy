module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['public/client/**/*.js', 'public/lib/**/*.js'],
        dest: 'public/dist/built.js',
      },
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      target: {
        files: {
          'public/dist/built-mini.min.js': ['public/dist/built.js']
        }
      }
    },

    eslint: {
      target: [
        'public/client/**/*.js', 'public/app/**/*.js', 'public/lib/**/*.js'
      ]
    },

    cssmin: {
      target: {
        files: [{
          src: ['public/style.css'],
          dest: 'public/dist/style-minified',
          ext: '.min.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      gadd: {
        command: 'git add .'
      },
      gcommit: {
        command: message => 'git commit -m ' + '"' + message + '"'
      },
      gpush: {
        command: 'git push origin master'
      },
      prodServer: {
        command: 'git push live master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'test', 'eslint'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {

    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', function(n) {
    var message = grunt.option('m');
    grunt.task.run([ 'shell:gadd', 'shell:gcommit:' + message, 'shell:gpush' ]);

    // if (grunt.option('prod')) {
    //   grunt.task.run([ 'shell:prodServer' ]);
    // }
  });


};






























