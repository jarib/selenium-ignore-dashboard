task :env do
  require 'mongo'
  require 'json'
  require 'open-uri'
end

URL = "http://ci.seleniumhq.org/jarib/ignores.json"

namespace :db do
  desc "Take a snapshot of current ignores from #{URL}"
  task :snapshot => :env do
    collection = Mongo::Connection.new.db("selenium").collection("ignores")

    url = ENV['URL'] || URL
    data = JSON.parse(open(url).read)

    unique = {}

    data.each do |i|
      merged = {
        'testName'  => i['testName'],
        'className' => i['className'],
        'drivers'   => [],
        'issues'    => [],
        'reasons'   => []
      }

      [i['class'], i['method']].compact.each do |obj|
        merged['drivers'] += obj['drivers']
        merged['issues'] += obj['issues']
        merged['reasons'] << obj['reason']
      end

      merged['drivers'] = merged['drivers'].uniq.sort
      merged['issues'] = merged['issues'].uniq.sort
      merged['reason'] = merged.delete('reasons').join(" ")

      unique[[i['className'], i['testName']]] = merged
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
  sh "ssh", host, "cd /apps/selenium-ignores && git pull origin master && bundle install --path .bundle --binstubs && touch tmp/restart.txt"
end