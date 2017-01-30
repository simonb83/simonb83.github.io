function main() {
	var map = new L.Map('ecobici_day_in_life', {
		center: [19.416563, -99.164551],
		zoom: 13,
		scrollWheelZoom: false
	});

	var layer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
  		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}).addTo(map);

	cartodb.createLayer(map, {
		type: 'torque',
		order: 1,
		options:
			{
				query: 'SELECT * FROM trip_points_2',
				table_name: 'trip_points',
				user_name: 'simonb83',
				tile_style: 'Map{-torque-frame-count:2048;-torque-animation-duration:200;-torque-time-attribute:"time";-torque-aggregation-function:"count(cartodb_id)";-torque-resolution:1;-torque-data-aggregation:linear}#trip_points{comp-op:lighter;marker-fill-opacity:.9;marker-line-color:#FFF;marker-line-width:0;marker-line-opacity:1;marker-type:ellipse;marker-width:3;marker-fill:#0F3B82}'
			}
	}, {
		https: true
	}).done(function(layer) {
			map.addLayer(layer);
			layer.pause();
		});

}

window.onload = main();
