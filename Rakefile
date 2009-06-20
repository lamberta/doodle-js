Version = "doodle-0.1.js"

JsTestDriver = File.path "./build/JsTestDriver-1.0b.jar"
#conf must be in root dir- filed bug report with js-test-driver
JsTestDriverConf = File.path "./test-all.yml"

desc "Start JsTestDriver server."
task :test_server do
	port = 9876
	sh "java -jar #{JsTestDriver} --port #{port}"
end

desc "Run unit tests."
task :test_run do	
	sh "java -jar #{JsTestDriver} --config #{JsTestDriverConf} --tests all"
end

desc "Concat Javascript files."
task :build do
	#order does matter
	sh "cat ./src/compat/* > ./#{Version}"
	sh "cat ./src/doodle.js >> ./#{Version}"
	sh "cat ./src/matrix.js >> ./#{Version}"
	sh "cat ./src/canvas.js >> ./#{Version}"
	sh "cat ./src/point.js >> ./#{Version}"
	sh "cat ./src/object.js >> ./#{Version}"
	sh "cat ./src/sprite.js >> ./#{Version}"
	sh "cat ./src/group.js >> ./#{Version}"
	sh "cat ./src/rect.js >> ./#{Version}"
	sh "cat ./src/circle.js >> ./#{Version}"
	sh "cat ./src/image.js >> ./#{Version}"
end

task :clean do
	sh "rm ./doodle*.js"
end
