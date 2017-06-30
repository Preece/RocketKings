module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: ['./public/Src/**/*.js'],
      tasks: ['default']
    },
    browserify: {
      options: {
        debug: true,
      },
      dev: {
        src: './public/Src/**/*.js',
        dest: 'public/bundle.js'
      },
      production: {
        options: {
          debug: false
        },
        src: '<%= browserify.dev.src %>',
        dest: 'build/bundle.js'
      }
    }, 
  });
  grunt.loadNpmTasks('grunt-browserify'); 
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['browserify']);


};