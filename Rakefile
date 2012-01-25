task :env do
  require 'mongo'
  require 'json'
  require 'open-uri'
end

URL = "http://sci.illicitonion.com/jarib/ignores.json"

namespace :db do
  desc "Take a snapshot of current ignores from #{URL}"
  task :snapshot => :env do
    collection = Mongo::Connection.new.db("selenium").collection("ignores")
    data = JSON.parse(open(URL).read)

    unique = {}

    data.each do |i|
      unique[[i['className'], i['testName']]] = i
    end

    collection.insert(
      :timestamp => Time.now,
      :ignores   => unique.values
    )
  end
end

desc 'Release the app'
task :release do
  host = ENV['host'] or raise "please specify host"
  sh "git push origin master"
  sh "ssh", host, "cd /sites/selenium-ignores.jaribakken.com/selenium-ignore-dashboard && git pull origin master && touch tmp/restart.txt"
end