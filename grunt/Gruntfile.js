module.exports = function(grunt) {

    var src = ["../public/**/*.js", "!../public/lib/**/*.js"];

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        amdcheck: {
            src: {
                options: {
                    removeUnusedDependencies: false
                },
                files: [
                    {
                        expand: true,
                        src: src
                    }
                ]
            }
        },
        jshint: {
            options: require("./jshintoptions"),
            all: src
        }
    });

    grunt.loadNpmTasks('grunt-amdcheck');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('default', ['amdcheck:src', 'jshint']);
};