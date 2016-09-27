#!/usr/bin/env node

const
	program = require("commander"),
	download = require('download-file'),
	colors = require('colors'),
	request = require('request'),
	_ = require('lodash'),
	extract = require('extract-zip'),
	fs = require('fs'),
	ncp = require('ncp'),
	rimraf = require('rimraf'),
	icons = require("./icons")
;

// transform icon name (avoid spaces)
var iconNameTransform = function(name){
	return name.replace("-", " ");
};

// transform icon size (remove dp)
var iconSizeTransform = function(size){
	return size.replace("dp", "");
};

// set up commander options
program
.option("-n, --name [name]", "Name of the icon | ex. delete-forever", iconNameTransform, "delete forever")
.option("-s, --size [size]", "Size of the icon in dp | ex. 18", iconSizeTransform, 18)
.option("-c, --color [color]", "Color of the icon | ex. white", /^(white|black)$/, "black")
.parse(process.argv);

// get icon object from name
var iconObj = null;
for(i in icons.icons){
	var obj = icons.icons[i];

	if(obj.name.toLowerCase() == program.name.toLowerCase()){
		iconObj = obj;
		break;
	}
	else if(i == icons.icons.length - 1){
		console.log(colors.yellow("could not find icon!"));
		process.exit(0);
	}
};

// make .zip download link
var iconFile = iconObj.id + '_' + program.color + '_' + program.size + 'dp';
var fileName = iconFile + '.zip';
var zipDownloadLink = icons.base_path + 'icons/zip/' + fileName;

// download .zip file
download(zipDownloadLink, {filename : fileName}, function(err){
	
	// no icon pack file exist
	if(err){
		
		// show error
		console.log(colors.yellow("Failed to download icon pack. Please make sure you entered right icon size/color mentioned on https://design.google.com/icons"));
		
		// get sizes & colors info
		request("https://design.google.com/icons/data/"+iconObj.id+".json", function(err, res, body){
			if(!err && res.statusCode == 200) {
				var jsonBody = JSON.parse(body);

				if(jsonBody.assets && _.isArray(jsonBody.assets) && !_.isEmpty(jsonBody.assets)){
					for(i in jsonBody.assets){
						var assetDoc = jsonBody.assets[i];
						if(assetDoc.platform == 'android'){
							if(assetDoc.sizes && _.isArray(assetDoc.sizes)){
								console.log(
									colors.green("\nAvailable sizes are " + assetDoc.sizes.join(","))
								);
							}

							if(assetDoc.colors && _.isArray(assetDoc.colors)){
								console.log(
									colors.green("Available colors are " + assetDoc.colors.join(","))
								);
							}

							break;
						}
					}
				}
			}
		});	
	}
	else{

		// command window directory
		var cmdDir = process.cwd();						// C:\project
		var tmpDir = cmdDir + '/_tmp'; 					// C:\project\_tmp
		var iconDir = tmpDir + '/' + iconFile;			// C:\project\_tmp\ic_menu_24dp_black
		var androidIconDir =  iconDir + '/android/';	// C:\project\_tmp\ic_menu_24dp_black\android\

		// extract zip to temporary directory
		extract(fileName, {dir : tmpDir}, function(err){
			if(err){
				console.log(colors.yellow("Something went wrong while extracting icon pack."));
				console.log(err);
			}

			// remove .zip file
			fs.unlinkSync(fileName);

			// copy android files in current directory from which cmd was opened
			ncp(androidIconDir, cmdDir, function(err){
				if(err){
					console.log(err);
				}
				else{
					console.log(colors.green("Done!"));

					// remove temporary directory
					rimraf(tmpDir, {}, function(err){
						if(err){
							console.log(colors.grey("Failed to clean download directory."));
						}
					});
				}
			});
		});
	}
});




