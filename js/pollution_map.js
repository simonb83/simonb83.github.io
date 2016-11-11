function main() {
	var map = new L.Map('map', {
		center: [19.399766, -99.169485],
		zoom: 10,
		scrollWheelZoom: false
	});

	var layer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}).addTo(map);

	cartodb.createLayer(map, {
		legends: true,
		user_name: 'simonb83',
		type: 'cartodb',
		sublayers: [{
				sql: "SELECT * FROM peak_hours WHERE time::date = '2016-04-04'",
				cartocss: '#peak_hours{marker-fill-opacity:.8;marker-line-color:#FFF;marker-line-width:1;marker-line-opacity:1;marker-width:20;marker-fill:#FFFFB2;marker-allow-overlap:true}' + '#peak_hours [value<140]{marker-fill:#d22b27;marker-width:37}#peak_hours [value<126]{marker-fill:#ee613e;marker-width:34}#peak_hours [value<112]{marker-fill:#fa9b58;marker-width:31}#peak_hours [value<98]{marker-fill:#fece7c;marker-width:28}#peak_hours [value<84]{marker-fill:#fff1a8;marker-width:25}#peak_hours [value<70]{marker-fill:#eef8a8;marker-width:22}#peak_hours [value<56]{marker-fill:#c7e77f;marker-width:19}#peak_hours [value<42]{marker-fill:#93d168;marker-width:16}#peak_hours [value<28]{marker-fill:#57b65f;marker-width:13}#peak_hours [value<14]{marker-fill:#17934e;marker-width:10}'
			}]
	}, {
		https: true
	}).done(function(layer) {
			map.addLayer(layer);
		});

	var map2 = new L.Map('map-2', {
		center: [19.399766, -99.169485],
		zoom: 10,
		scrollWheelZoom: false
	});

	var layer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}).addTo(map2);

	cartodb.createLayer(map2, {
		user_name: 'simonb83',
		type: 'cartodb',
		sublayers: [{
				sql: "SELECT * FROM peak_hours WHERE time::date = '2016-09-26'",
				cartocss: '#peak_hours{marker-fill-opacity:.8;marker-line-color:#FFF;marker-line-width:1;marker-line-opacity:1;marker-width:20;marker-fill:#FFFFB2;marker-allow-overlap:true}' + '#peak_hours [value<140]{marker-fill:#d22b27;marker-width:37}#peak_hours [value<126]{marker-fill:#ee613e;marker-width:34}#peak_hours [value<112]{marker-fill:#fa9b58;marker-width:31}#peak_hours [value<98]{marker-fill:#fece7c;marker-width:28}#peak_hours [value<84]{marker-fill:#fff1a8;marker-width:25}#peak_hours [value<70]{marker-fill:#eef8a8;marker-width:22}#peak_hours [value<56]{marker-fill:#c7e77f;marker-width:19}#peak_hours [value<42]{marker-fill:#93d168;marker-width:16}#peak_hours [value<28]{marker-fill:#57b65f;marker-width:13}#peak_hours [value<14]{marker-fill:#17934e;marker-width:10}'
			}]
	}, {
		https: true
	}).done(function(layer) {
			map2.addLayer(layer);
		});

	var map4 = new L.Map('dynamic_2', {
		center: [19.399766, -99.169485],
		zoom: 10,
		minZoom: 9,
		maxZoom: 11,
		scrollWheelZoom: false
	});

	var layer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}).addTo(map4);

	cartodb.createLayer(map4, {
		type: 'torque',
		order: 1,
		options:
			{
				query: 'select *, (CASE WHEN "value" = 0 THEN 1 WHEN "value" = 1 THEN 2 WHEN "value" = 2 THEN 3 WHEN "value" = 3 THEN 4 WHEN "value" = 4 THEN 5 WHEN "value" = 5 THEN 6 WHEN "value" = 6 THEN 7 WHEN "value" = 7 THEN 8 WHEN "value" = 8 THEN 9 WHEN "value" = 9 THEN 10 ELSE 11 END) as torque_category FROM (SELECT *\nFROM pollution_dynamic WHERE time::date > \'2016-06-01\') _cdb_wrap',
				table_name: 'pollution_dynamic',
				user_name: 'simonb83',
				tile_style: '/** torque_cat visualization */\n\nMap {\n-torque-frame-count:256;\n-torque-animation-duration:35;\n-torque-time-attribute:"time";\n-torque-aggregation-function:"CDB_Math_Mode(torque_category)";\n-torque-resolution:2;\n-torque-data-aggregation:linear;\n}\n\n#pollution_dynamic{\n  comp-op: source-over;\n  marker-fill-opacity: 0.9;\n  marker-line-color: #FFF;\n  marker-line-width: 0;\n  marker-line-opacity: 1;\n  marker-type: ellipse;\n  marker-width: 6;\n  marker-fill: #0F3B82;\n}\n#pollution_dynamic[value=1]{marker-fill:#17934e;marker-width:10}#pollution_dynamic[value=2]{marker-fill:#57b65f;marker-width:12}#pollution_dynamic[value=3]{marker-fill:#93d168;marker-width:14}#pollution_dynamic[value=4]{marker-fill:#c7e77f;marker-width:16}#pollution_dynamic[value=5]{marker-fill:#eef8a8;marker-width:18}#pollution_dynamic[value=6]{marker-fill:#fff1a8;marker-width:20}#pollution_dynamic[value=7]{marker-fill:#fece7c;marker-width:22}#pollution_dynamic[value=8]{marker-fill:#fa9b58;marker-width:24}#pollution_dynamic[value=9]{marker-fill:#ee613e;marker-width:26}#pollution_dynamic[value=10]{marker-fill:#d22b27;marker-width:28}'
			}
	}, {
		https: true
	}).done(function(layer) {
			map4.addLayer(layer);
			layer.pause();
		});

	var map3 = new L.Map('dynamic_1', {
		center: [19.399766, -99.169485],
		zoom: 10,
		minZoom: 9,
		maxZoom: 11,
		scrollWheelZoom: false
	});

	var layer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}).addTo(map3);

	cartodb.createLayer(map3, {
		type: 'torque',
		order: 1,
		options:
			{
				query: 'select *, (CASE WHEN "value" = 0 THEN 1 WHEN "value" = 1 THEN 2 WHEN "value" = 2 THEN 3 WHEN "value" = 3 THEN 4 WHEN "value" = 4 THEN 5 WHEN "value" = 5 THEN 6 WHEN "value" = 6 THEN 7 WHEN "value" = 7 THEN 8 WHEN "value" = 8 THEN 9 WHEN "value" = 9 THEN 10 ELSE 11 END) as torque_category FROM (SELECT *\nFROM pollution_dynamic WHERE time::date < \'2016-06-01\') _cdb_wrap',
				table_name: 'pollution_dynamic',
				user_name: 'simonb83',
				tile_style: '/** torque_cat visualization */\n\nMap {\n-torque-frame-count:256;\n-torque-animation-duration:35;\n-torque-time-attribute:"time";\n-torque-aggregation-function:"CDB_Math_Mode(torque_category)";\n-torque-resolution:2;\n-torque-data-aggregation:linear;\n}\n\n#pollution_dynamic{\n  comp-op: source-over;\n  marker-fill-opacity: 0.9;\n  marker-line-color: #FFF;\n  marker-line-width: 0;\n  marker-line-opacity: 1;\n  marker-type: ellipse;\n  marker-width: 6;\n  marker-fill: #0F3B82;\n}\n#pollution_dynamic[value=1]{marker-fill:#17934e;marker-width:10}#pollution_dynamic[value=2]{marker-fill:#57b65f;marker-width:12}#pollution_dynamic[value=3]{marker-fill:#93d168;marker-width:14}#pollution_dynamic[value=4]{marker-fill:#c7e77f;marker-width:16}#pollution_dynamic[value=5]{marker-fill:#eef8a8;marker-width:18}#pollution_dynamic[value=6]{marker-fill:#fff1a8;marker-width:20}#pollution_dynamic[value=7]{marker-fill:#fece7c;marker-width:22}#pollution_dynamic[value=8]{marker-fill:#fa9b58;marker-width:24}#pollution_dynamic[value=9]{marker-fill:#ee613e;marker-width:26}#pollution_dynamic[value=10]{marker-fill:#d22b27;marker-width:28}'
			}
	}, {
		https: true
	}).done(function(layer) {
			map3.addLayer(layer);
			layer.pause();
		});

	var legend = new cdb.geo.ui.Legend({
           type: "choropleth",
           show_title: true,
           title: "Ozone (ppb)",
           data: [
			{ value: "0" },
			{ value: "140" },
			{ name: "color0", value: "#17934e"},
			{ name: "color1", value: "#57b65f"},
			{ name: "color2", value: "#93d168"},
			{ name: "color3", value: "#c7e77f"},
			{ name: "color4", value: "#eef8a8"},
			{ name: "color5", value: "#fff1a8"},
			{ name: "color6", value: "#fece7c"},
			{ name: "color7", value: "#fa9b58"},
			{ name: "color8", value: "#ee613e"},
			{ name: "color9", value: "#d22b27"}
           ]
         });

	var legend2 = new cdb.geo.ui.Legend({
           type: "choropleth",
           show_title: true,
           title: "Ozone (ppb)",
           data: [
			{ value: "0" },
			{ value: "140" },
			{ name: "color0", value: "#17934e"},
			{ name: "color1", value: "#57b65f"},
			{ name: "color2", value: "#93d168"},
			{ name: "color3", value: "#c7e77f"},
			{ name: "color4", value: "#eef8a8"},
			{ name: "color5", value: "#fff1a8"},
			{ name: "color6", value: "#fece7c"},
			{ name: "color7", value: "#fa9b58"},
			{ name: "color8", value: "#ee613e"},
			{ name: "color9", value: "#d22b27"}
           ]
         });

	$('#map').append(legend.render().el);
	$('#map-2').append(legend2.render().el);
}

window.onload = main();