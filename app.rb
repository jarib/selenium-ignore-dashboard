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

  { :ignores => current_ignores }.to_json
end

get "/ignores/:driver.json" do |driver|
  content_type :json

  drivers = driver.split(",").map { |d| d.upcase }

  {
    :ignores => current_ignores.select { |ig| (ig.driver_names & drivers).any? }
  }.to_json
end

helpers do
  def current_ignores
    data = settings.db.find.sort([:_id, :descending]).limit(1).first.fetch('ignores')
    data.map { |e| IgnoreView.new(e) }.sort_by { |ig| ig.name }
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
    }
  end

  def driver_names
    @data['drivers']
  end

  def drivers
    driver_names.map { |name| { :name => name } }
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