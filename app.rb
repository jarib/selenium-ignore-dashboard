require 'sinatra'
require 'mongo'
require 'json'

configure do
  set :db, Mongo::Connection.new.db("selenium").collection("ignores")
  set :public_folder, File.expand_path("../public", __FILE__)
end

get "/" do
  erb :ignores
end

get "/ignores.json" do
  content_type :json

  ignores = current_ignores.map { |e| IgnoreView.new(e) }

  ignores = ignores.sort_by { |ig| ig.name }
  ignores.to_json
end

get "/ignores/:driver.json" do |driver|
  content_type :json

  ignores = current_ignores.map { |e| IgnoreView.new(e) }.select { |ig| ig.drivers.include? driver }

  ignores = ignores.sort_by { |ig| ig.name }
  ignores.to_json
end

helpers do
  def current_ignores
    settings.db.find.sort([:_id, :descending]).limit(1).first.fetch('ignores')
  end
end

class IgnoreView
  def initialize(data)
    @data = data
  end

  def as_json(opts = nil)
    {
      :name          => name,
      :drivers       => drivers,
      :driver_string => drivers.join(", ")
    }
  end

  def drivers
    @data['drivers']
  end

  def name
    [class_name, test_name].join "."
  end

  def full_class_name
    @data['className']
  end

  def class_name
    full_class_name.split(".").last
  end

  def test_name
    @data['testName']
  end

  def to_json(*args)
    as_json.to_json(*args)
  end
end