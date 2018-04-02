json.array! @trips do |trip|
  json.title trip.title
  json.description trip.description
  json.city trip.city
  json.state trip.state
  json.country trip.country
  json.start_date trip.start_date
  json.end_date trip.end_date
  json.link trip.link
  json.photo asset_url(trip.photo.url(:med))
end