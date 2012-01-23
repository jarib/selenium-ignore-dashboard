task :env do
  require 'mongo'
  require 'json'
  require 'open-uri'
end

namespace :db do
  task :snapshot => :env do
    collection = Mongo::Connection.new.db("selenium").collection("ignores")
    data = JSON.parse(open("http://sci.illicitonion.com/jarib/ignores.json").read)

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