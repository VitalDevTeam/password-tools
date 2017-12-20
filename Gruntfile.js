module.exports = function(grunt) {
    'use strict';

    var globalConfig = {
        scripts: 'assets/scripts',
        css: 'assets/css',
        images: 'assets/images',
        scss: 'assets/scss'
    };

    grunt.initConfig({
        globalConfig: globalConfig,
        pkg: grunt.file.readJSON('package.json'),
        browserSync: {
            debug: {
                bsFiles: {
                    src: [
                        '<%= globalConfig.scripts %>/site/*.js',
                        '<%= globalConfig.css %>/*.css',
                        '<%= globalConfig.images %>/**/*.{jpg,gif,png,svg}',
                        '*.php',
                        '*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    proxy: 'password.local',
                    port: 1337
                }
            }
        },
        clean: {
            production: {
                options: {
                    force: true
                },
                src: ['<%= globalConfig.css %>/*.css.map']
            }
        },
        concat: {
            debug: {
                src: '<%= globalConfig.scripts %>/source/*.js',
                dest: '<%= globalConfig.scripts %>/site/main.js'
            }
        },
        imagemin: {
            debug: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    cwd: '<%= globalConfig.images %>/source/',
                    src: '**/*.{jpg,png,gif,svg}',
                    dest: '<%= globalConfig.images %>/'
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            all: ['<%= globalConfig.scripts %>/source/*.js']
        },
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({ expand: true, flatten: true, browsers: ['> 1%', 'last 2 versions'] })
                ]
            },
            development: {
                options: {
                    map: {
                        inline: true
                    }
                },
                src: ['<%= globalConfig.css %>/*.css']
            },
            production: {
                options: {
                    map: false,
                    processors: [
                        require('css-mqpacker')({ sort: true })
                    ]
                },
                src: ['<%= globalConfig.css %>/*.css']
            }
        },
        sass: {
            options: {
                precision: 3,
                style: 'expanded',
                sourcemap: 'none'
            },
            development: {
                options: {
                    sourcemap: 'inline'
                },
                files: {
                    '<%= globalConfig.css %>/main.css': '<%= globalConfig.scss %>/main.scss'
                }
            },
            production: {
                files: {
                '<%= globalConfig.css %>/main.css': '<%= globalConfig.scss %>/main.scss'
                }
            }
        },
        watch: {
            options: {
                spawn: false
            },
            css: {
                files: '<%= globalConfig.scss %>/*.scss',
                tasks: ['css']
            },
            html: {
                files: '*.html'
            },
            img: {
                files: '<%= globalConfig.images %>/source/**/*.{jpg,gif,png,svg}',
                tasks: ['img']
            },
            scripts: {
                files: '<%= globalConfig.scripts %>/source/*.js',
                tasks: ['js']
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('css', ['sass:development', 'postcss:development']);
    grunt.registerTask('img', ['newer:imagemin:debug']);
    grunt.registerTask('js', ['jshint', 'concat']);
    grunt.registerTask('deploy', ['sass:production', 'postcss:production', 'clean:production']);
    grunt.registerTask('default', ['browserSync', 'watch']);
}
