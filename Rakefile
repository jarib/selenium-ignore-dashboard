task :env do
  require 'mongo'
  require 'json'
end

namespace :db do
  task :snapshot => :env do
    repo = ENV['SELENIUM_ROOT'] or raise "please set SELENIUM_ROOT"

    collection = Mongo::Connection.new.db("selenium").collection("ignores")

    Dir.chdir(repo) do
      sh "./go", "//java/client/test/org/openqa/selenium:dump-ignores:run"

      data = JSON.parse(File.read("ignores.json"))
      collection.insert(
        :timestamp => Time.now,
        :ignores   => data
      )
    end
  end
end