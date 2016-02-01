module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        sourceMap: false,
        compress: {
          drop_console: true
        }
      },
      js: {
        files: {
          'dist/jquery-dashboard.min.js': 'src/jquery-dashboard.js'
        }
      }
    },
    less: {
      development: {
        files: {
          'dist/dashboard.css': 'src/less/dashboard.less'
        }
      }
    },
    watch: {
      css: {
        files: ['src/less/*.less'],
        tasks: ['less']
      },
      js: {
        files: ['src/*.js'],
        tasks: ['uglify']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['uglify','less']);
};
