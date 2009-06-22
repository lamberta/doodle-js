Version = "doodle-0.1"

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
task :build do
	outfile = "#{Version}.js"
	#order does matter
	sh "cat ./src/compat/* > ./#{outfile}"
	sh "cat ./src/doodle.js >> ./#{outfile}"
	sh "cat ./src/matrix.js >> ./#{outfile}"
	sh "cat ./src/canvas.js >> ./#{outfile}"
	sh "cat ./src/point.js >> ./#{outfile}"
	sh "cat ./src/object.js >> ./#{outfile}"
	sh "cat ./src/sprite.js >> ./#{outfile}"
	sh "cat ./src/group.js >> ./#{outfile}"
	sh "cat ./src/rect.js >> ./#{outfile}"
	sh "cat ./src/circle.js >> ./#{outfile}"
	sh "cat ./src/image.js >> ./#{outfile}"
end

desc "Minify Javascript."
task :min do
	sh "java -jar #{YUICompressor} #{Version}.js -o #{Version}.min.js"
end

desc "Remove built files."
task :clean do
	sh "rm ./doodle*.js"
end
