Version = "doodle-0.1.1"
Buildfile = File.path "./#{Version}.js"

JsLint = File.path "./build/jslint.js"
Rhino = File.path "./build/js.jar"

JsTestDriver = File.path "./build/JsTestDriver-1.0b.jar"
#conf must be in root dir- filed bug report with js-test-driver
JsTestDriverConf = File.path "./test-all.yml"

YUICompressor = File.path "./build/yuicompressor-2.4.2.jar"


task :help do
	sh "rake -T"
end

desc "Start JsTestDriver server."
task :test_server do
	port = 9876
	sh "java -jar #{JsTestDriver} --port #{port}"
end

desc "Run unit tests."
task :test_run do	
	sh "java -jar #{JsTestDriver} --config #{JsTestDriverConf} --tests all"
end

desc "Run JsLint."
task :jslint do
	sh "java -jar #{Rhino} #{JsLint} ./src/*"
end

desc "Concat Javascript files."
task :build => Buildfile do
	#order does matter
	sh "cat ./src/compat/* >> #{Buildfile}"
	sh "cat ./src/doodle.js >> #{Buildfile}"
	sh "cat ./src/matrix.js >> #{Buildfile}"
	sh "cat ./src/canvas.js >> #{Buildfile}"
	sh "cat ./src/point.js >> #{Buildfile}"
	sh "cat ./src/object.js >> #{Buildfile}"
	sh "cat ./src/sprite.js >> #{Buildfile}"
	sh "cat ./src/group.js >> #{Buildfile}"
	sh "cat ./src/rect.js >> #{Buildfile}"
	sh "cat ./src/circle.js >> #{Buildfile}"
	sh "cat ./src/image.js >> #{Buildfile}"
end

desc "Minify Javascript."
task :min do
	sh "java -jar #{YUICompressor} #{Version}.js -o #{Version}.min.js"
end

desc "Remove built files."
task :clean do
	sh "rm ./doodle*.js"
end

#header
file Buildfile do
	begin
		f = File.open(Buildfile, "w")
		f.puts "/* #{Version} - http://www.lamberta.org/blog/doodle */"
	ensure
		f.close if f
	end
end
