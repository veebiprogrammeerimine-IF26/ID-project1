const http = require('http');
//moodul URL-i parsimiseks
const url = require('url');
//moodul failiteede haldamiseks
const path = require('path');
//const fs = require('fs');
const fs = require('fs').promises;
const dateET = require('./src/dateTimeET');
const textRef = "txt/vanasonad.txt";
const pageHead = '<!DOCTYPE html>\n<html lang="et">\n<head>\n\t<meta charset="utf-8">\n\t<title>Andrus Rinde, veebiprogrammeerimine</title>\n</head>\n<body>\n';
const pageBanner = '\t<img src="veebiprogrammeerimine_2026_ID.png" alt="bänner">\n';
const pageBody = '\t<h1>Andrus Rinde, veebiprogrammeerimine</h1>\n\t <p>See leht on loodud veebiprogrammeerimise kursusel <a href="https://www.tlu.ee">Tallinna Ülikoolis</a> ning ei sislda tõsiseltvõetavat sisu!</p>\n\t<p>Esialgu tutvusime lihtsalt HTML keelega, nüüd juba programmeerime.</p>\n\t<hr>';
const pageFoot = '\n</body>\n</html>';

http.createServer(async function(req, res){
	//vaatan URL-i
	console.log('Päring: ' + req.url);
	//parsin URL-i
	let currentURL = url.parse(req.url, true);
	console.log('Parsituna: ' + currentURL.pathname);
	//console.log('Parsituna: ' + currentURL.port);
	
	if(currentURL.pathname === '/'){
		res.writeHead(200, {"Content-type": "text/html"});
		//res.write('Veebiserver käivitus!');
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write('\n\t<p>Täna on ' + dateET.day() + ', ' + dateET.date(Math.round(Math.random())) + ', kell oli lehe avamise hetkel: ' + dateET.time() +'.</p>');
		res.write('\n\t<ul>');
		res.write('\n\t\t<li><a href="/tlu">Tallinna Ülikool</a></li>');
		res.write('\n\t\t<li><a href="/vanasona">Tänane vanasõna</a></li>');
		res.write('\n\t</ul>');
		res.write(pageFoot);
		return res.end();
	}
	
	else if(currentURL.pathname === '/vanasona'){
		res.writeHead(200, {"Content-type": "text/html"});
		try {
			const data = await fs.readFile(textRef, "utf8");
			let folkWisdom = data.split(";");
			res.write(pageHead);
			res.write(pageBanner);
			res.write('\t<h1>Eesti vanasõnad</h1>\n\t<p>Siin näed tänase päeva vanasõna.</p>');
			res.write('\n\t<p>Tänane vanasõna on: ' + folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))] + '</p><hr>')
			res.write('\n\t<p><a href="/">Tagasi avalehele</a></p>');
			res.write(pageFoot);
			return res.end();
		} catch (err){
			res.write(pageHead);
			res.write(pageBanner);
			res.write('\t<h1>Eesti vanasõnad</h1>\n\t<p>Siin näed tänase päeva vanasõna.</p>');
			res.write('\n\t<p>Mida kahjuks ei leitud!</p><hr>')
			res.write('\n\t<p><a href="/">Tagasi avalehele</a></p>');
			res.write(pageFoot);
			return res.end();
		}
	}
	
	else if (currentURL.pathname === '/veebiprogrammeerimine_2026_ID.png'){
		//liidame kättesaamatu päris kataloog jms virtuaalseks failiteeks
		let bannerPath = path.join(__dirname, 'pic', currentURL.pathname);
		try {
			const data = await fs.readFile(bannerPath);
			res.writeHead(200, {"Content-type": "image/png"});
			return res.end(data);
		} catch (err) {
			res.writeHead(404, {"Content-type": "text/plain; charset=ut8"});
			return res.end('Pilti ei leitud!');
		}
	}
	
	/* else if (currentURL.pathname === '/veebiprogrammeerimine_2026_ID.png'){
		//liidame kättesaamatu päris kataloog jms virtuaalseks failiteeks
		let bannerPath = path.join(__dirname, 'pic', currentURL.pathname);
		console.log('Bänneri failitee: ' + bannerPath);
		fs.readFile(bannerPath, (err, data)=>{
			if(err){
				throw(err);
			} else {
				res.writeHead(200, {"Content-type": "image/png"});
				res.end(data);
			}
		});
	} */
	
	else if (currentURL.pathname === '/tlu'){
		res.writeHead(200, {"Content-type": "text/html"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write('\n\t<h1>Tallinna Ülikool</h1>\n\t<p>Tallinna Ülikool loodi 18. märtsil 2005. aastal Riigikogu otsusega mitme Tallinnas asuva kõrgkooli ja teadusasutuse ühinemise tulemusena.</p>');
		res.write('\n\t<p>Tallinna Ülikooli vanim õppehoone on 1940. aastal ehitatud Terra hoone Narva mnt 25, mis pikki aastaid oli ka ülikooli peamajaks.</p>')
		res.write('\n\t\<img src="tlu_42.jpg" alt="TLÜ Terra hoone peauks">');
		res.write('\n\t<p>Nüüdseks on pea kõik ülikooli hooned uued ehitatud. Digitehnoloogiate instituudi ruumid paiknevad peamiselt Astra õppehoones.</p>');
		res.write('\n\t<img src="tlu_37.jpg" alt="Vaade Astra õppehoonele">\n\t<hr>');
		res.write('\n\t<p><a href="/">Tagasi avalehele</a></p>');
		res.write(pageFoot);
		//res.write('Veeb läkski käima!');
		return res.end();
	}

	else if(path.extname(currentURL.pathname) === '.jpg' || path.extname(currentURL.pathname) === '.JPG'){
		//teeme pildi tegeliku asukoha programmile kättesaadavaks
		let picPath = path.join(__dirname, 'pic', currentURL.pathname);
		try {
			const data = await fs.readFile(picPath);
			res.writeHead(200, {"Content-type": "image/jpeg"});
			res.end(data);
		} catch (err){
			res.writeHead(404, {"Content-type": "text/plain; charset=utf8"});
			return res.end('Pilti ei leitud!');
		}
	}
	
	else {
		return res.end('Viga 404! Ei leia sellist lehte!');
	}
}).listen(5200);