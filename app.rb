require 'sinatra'
require 'mongo'
require 'json'

configure do
  set :db, Mongo::Connection.new.db("selenium").collection("ignores")
  set :public_folder, File.expand_path("../public", __FILE__)
end

get "/" do
  erb :app
end

get "/ignores.json" do
  content_type :json

  ignores = current_ignores
  {
    :ignores => ignores,
    :count   => ignores.size,
  }.to_json
end

get "/stats.json" do
  content_type :json

  data = settings.db.find.sort([:_id, :ascending]).to_a
  dates = data.map { |e| e['timestamp'].strftime("%Y-%m-%d") }

  result = Hash.new { |hash, driver| hash[driver] = [] }

  data.each do |entry|
    driver_counts = Hash.new(0)

    entry['ignores'].each do |ignore|
      ignore['drivers'].each do |driver|
        driver_counts[driver] += 1
      end
    end

    driver_counts.each do |name, count|
      result[name] << count
    end
  end

  series = result.sort_by { |_, c| c.last || 0 }.reverse.map do |name, counts|
    {:name => name.downcase, :data => counts}
  end

  {
    :dates => dates,
    :series => series
  }.to_json
end

get "/ignores/:drivers.json" do |drivers|
  content_type :json

  drivers = drivers.split(",").map { |d| d.upcase }
  ignores = ignores_for(drivers)

  {
    :ignores => ignores,
    :count   => ignores.size,
    :driver  => {:name => driver}
  }.to_json
end

get "/drivers.json" do
  content_type :json

  names = current_ignores.map { |e| e.driver_names }.flatten.uniq
  names.map! { |n| { :name => n } }

  {:drivers => names}.to_json
end

get "/diff/:drivers.json" do |drivers|
  content_type :json

  drivers = drivers.split(",").map { |d| d.upcase }
  ignores = ignores_for(drivers)

  ignores.map { |ig|
    names = ig.driver_names
    a, b = *drivers

    if names.include? a and names.include? b
      # ignored for both drivers - do nothing
    elsif names.include? drivers[0]
      ig.as_json.merge(:side => "left")
    else
      ig.as_json.merge(:side => "right")
    end
  }.compact.to_json
end

helpers do
  def current_ignores
    data = settings.db.find.sort([:_id, :descending]).limit(1).first.fetch('ignores')
    data.map { |e| IgnoreView.new(e) }.sort_by { |ig| ig.name }
  end

  def ignores_for(drivers)

    current_ignores.select { |ig| (ig.driver_names & drivers).any? }
  end
end

class IgnoreView
  def initialize(data)
    @data = data
  end

  def as_json(opts = nil)
    {
      :name             => name,
      :class_name       => class_name,
      :short_class_name => short_class_name,
      :test_name        => test_name,
      :drivers          => drivers,
      :url              => url,
      :reason           => reason,
      :issues           => issues
    }
  end

  def driver_names
    @data['drivers']
  end

  def reason
    @data['reason']
  end

  def issues
    Array(@data['issues']).map do |id|
      {
        :url => "http://code.google.com/p/selenium/issues/detail?id=#{id}",
        :id  => id
      }
    end
  end

  def url
    "http://code.google.com/p/selenium/source/browse/trunk/java/client/test/#{class_name.gsub '.', '/'}.java"
  end

  def drivers
    driver_names.map { |name| { :name => name } }
  end

  def name
    [class_name, test_name].join "."
  end

  def class_name
    @data['className']
  end

  def short_class_name
    class_name.split(".").last
  end

  def test_name
    @data['testName']
  end

  def to_json(*args)
    as_json.to_json(*args)
  end
end