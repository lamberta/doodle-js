Version = "0.1.1"

JsLint = File.path "./build/jslint.js"
Rhino = File.path "./build/js.jar"

JsTestDriver = File.path "./build/JsTestDriver-1.0b.jar"
#conf must be in root dir- filed bug report with js-test-driver
JsTestDriverConf = File.path "./test-all.yml"

YUICompressor = File.path "./build/yuicompressor-2.4.2.jar"

Header = File.path "./build/header"

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
task :build => Header do
	buildfile = File.path "./doodle-#{Version}.js"
	#order does matter
	sh "cat #{Header} > #{buildfile}"
	sh "cat ./src/compat/* >> #{buildfile}"
	sh "cat ./src/doodle.js >> #{buildfile}"
	sh "cat ./src/matrix.js >> #{buildfile}"
	sh "cat ./src/canvas.js >> #{buildfile}"
	sh "cat ./src/point.js >> #{buildfile}"
	sh "cat ./src/object.js >> #{buildfile}"
	sh "cat ./src/sprite.js >> #{buildfile}"
	sh "cat ./src/group.js >> #{buildfile}"
	sh "cat ./src/rect.js >> #{buildfile}"
	sh "cat ./src/circle.js >> #{buildfile}"
	sh "cat ./src/image.js >> #{buildfile}"
end

desc "Minify Javascript."
task :min do
	buildfile = File.path "./doodle-#{Version}.js"
	temp = File.path "./build/temp"
	outfile = File.path "./doodle-#{Version}.min.js"
	sh "java -jar #{YUICompressor} #{buildfile} -o #{temp}"
	sh "cat #{Header} > #{outfile}"
	sh "cat #{temp} >> #{outfile}"
	rm temp
end

desc "Remove built files."
task :clean do
	sh "rm ./doodle*.js #{Header}"
end

file Header do
	begin
		f = File.open(Header, "w")
		f.puts "/* doodle.js v#{Version}, http://www.lamberta.org/blog/doodle"
		f.puts " */"
	ensure
		f.close if f
	end
end
