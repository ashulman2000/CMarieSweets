module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: {
        src: [ 'build' ]
      },
    },
    copy: {
      build: {
        cwd: 'www',
        src: [ '**' ],
        dest: '<%= grunt.config.get("destination") %>',
        expand: true
      }
    },
		config: {
			dev: {
				options: {
					variables: {
						'environment': 'development',
						'destination': './temp/'
					}
				}
			},
			prod: {
				options: {
					variables: {
						'environment': 'production',
						'destination': './dist/'
					}
				}
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			scripts: {
				files: {
					'<%= grunt.config.get("destination") %>index.min.js': ['resources/*.js']
				}
			}
		},
    cssmin: {
      build: {
        files: {
          '<%= grunt.config.get("destination") %>application.min.css': [ 'www/**.css' ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [
          {
            expand: true,
            cwd: 'www',
            src: ['**.html'],
            dest: '<%= grunt.config.get("destination") %>',
          }
        ]
      }
    },
		concat: {
			options: {
				separator: ';'
			},
			scripts: {
				src: ['www/resources/*.js'],
				dest: '<%= grunt.config.get("destination") %>index.js'
			},
      styles: {
				src: ['www/**.css'],
				dest: '<%= grunt.config.get("destination") %>application.css'
      }
		},
		express: {
			all: {
				options: {
					port: 8090,
					hostname: "localhost",
					bases: ['<%= grunt.config.get("destination") %>'],
					livereload: true
				}
			}
		},
		open: {
			all: {
				path: 'http://localhost:<%= express.all.options.port%>'
			}
		},
		watch: {
			scripts: {
				files: ['www/**.js', 'www/**.html', 'www/**.css'],
				tasks: ['config:dev', 'clean', 'copy', 'concat', 'uglify', 'cssmin', 'htmlmin'],
				options: {
					livereload: true
				}
			}
		}
	});
  
	grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-config');
	grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-open');
	
	grunt.registerTask('default', ['config:dev', 'clean', 'copy', 'uglify', 'cssmin', 'htmlmin', 'concat', 'cssmin', 'express', 'open', 'watch']);
	grunt.registerTask('build', ['config:prod', 'clean', 'copy', 'uglify', 'cssmin', 'htmlmin', 'concat']);
};