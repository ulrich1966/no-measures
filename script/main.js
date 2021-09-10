/**
 * 
 */
const img_full = "heigt: 120%";
const img_car = "width: 50%; height: 50%;";
const img_tags = [];
var sizes = null;
var fullSreen = false;
var perc = 0;
var current_img_index = 0;
var elem_height = 0;
var leps = 0;
var current_count = 0;

/**	
	Nachdem die Webseite geladen ist, wird diese Methode aufgerufen
 */
$(document).ready(function() {
	console.log("document ready!");
	//$("body").css("font-family", "myriad-pro");
	font = $("body").css("font-family");
	console.log(font);
	sizes = dementions();
	console.log("scrHeight : " + sizes.scrHeight);
	console.log("scrWidth : " + sizes.scrWidth);
	console.log("winHeight : " + sizes.winHeight);
	console.log("winWidth : " + sizes.winWidth);
});

/**
	Ein Onjett, das Informationen ueber Bildschirm- und Fenstergroessen haelt	
 */
function dementions() {
	return { scrHeight: screen.height, scrWidth: screen.width, winHeight: window.innerHeight, winWidth: window.innerWidth };
}

/**
	Den Footer laden
 */
function loadFooter(fragment) {
	$("#footer").load(fragment);
}

/**
	Den Header laden
 */
function loadHeader(fragment) {
	$("#header").load(fragment);
}

/**
	Den Header laden
 */
function loadNavBar(fragment) {
	$("#nav").load(fragment);
}

/**
	Conent laden
 */
function loadContent(fragment) {
	$("#content").load(fragment);
}

/**
	Informationen ueber Hoehe, Weite und Alternativtext eines Bild-Tags ausgeben
 */
function imgSize(elem) {
	var height = $(elem).height();
	var width = $(elem).width();
	var alt = $(elem).attr("alt");
	console.log("name=" + alt + " h= " + height + " w= " + width);
}

/**
	Haendler fuer das 'Slide-Event' des Carousels
	- Ruft Methode (setImgDescrition(...)) mit dem aktuellen Index zum setzen 
	  der Bildbeschreibungen auf.  
 */
function carouselSlideHandler(img_objects, element_id) {
	current_img_index = current_img_index + 1;
	if (current_img_index >= img_objects.length) {
		current_img_index = 0;
	}
	setImgDescrition(img_objects, element_id, current_img_index);
}

/**
	- Findet das aktuell angezeigte Bild und den dazu passendenden Text.
	- Generiert Ueberschrift - und Text - Tag und fuellt diesem mit den
	  entsprechenden Texten aus dem img_object. 
	- Holt das zu manipulierende Element via uebergebenen Id und ersetzt 
	  hierin die generierten Tags.    
 */
function setImgDescrition(img_objects, element_id, index) {
	var img_object = img_objects[index];
	var h5 = $("<h5></h5>").text(img_object.lbl);
	var p_txt = $("<p></p>").text(img_object.txt);
	var a = "<a href='" + img_object.link.href + "' target='_blank'>" + img_object.link.txt + "</a>";
	var p_link = $("<p></p>").append(a);
	$(element_id).empty();
	$(element_id).append(h5, p_txt, p_link);
}

function manageSize(operation, element) {
	if (operation == "write") {
		$(element).height(elem_height);
	} else if (operation == "read") {
		elem_height = $(element).height();
	}
}

/**
	- Full Sreen Mode wechseln bzw. zurueck zum Winsow Mode
	- Wenn full sreen vorhger die aktuelle Hoehe des Carousels mit manageSize(...) zwiechenspeichern,
	  damit die Normalansicht zuruecksetzen werden kann.
	- Wenn cancel full sreen die vorhger gespeicherte Hoehe des Carousels mit manageSize(...) wiederherstellen.
 */
function toggleFullScreen(element) {
	if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
		manageSize("read", element);
		upSizeImages();
		if (element.requestFullScreen) {
			element.requestFullScreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullScreen) {
			element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	} else {
		//downSizeImages();
		//manageSize("write", element);
		if (document.cancelFullScreen) {
			document.cancelFullScreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
		location.reload();
	}
}

/**
	Konfiguratioen der Hoehe fuer div und img Elemenete 
	entspraechend der Fenstergroesse bei 'Full Sreen'
 */
function downSizeImages(value) {
	if (value != null) {
		perc = (sizes.winHeight / 10) * value;
	}
	$(".slide-img").css("height", perc);
}

/**
	Konfiguratioen der Hoehe fuer div und img Elemenete 
	entspraechend der Fenstergroesse bei 'Full Sreen'
 */
function upSizeImages() {
	var pedding = 50;
	$(".carousel-inner").css("height", sizes.scrHeight);
	$(".carousel-inner").css("padding", pedding);
	$(".slide-img").css("height", sizes.scrHeight - 2 * pedding);
}

/**	
	- Iterriert ueber das uebergbene Objekt Array mit den Immage - Parametern
	  Ezeigt ein neues IMG - Element, weist diesem die Attribute aus dem 
	  aktuellem Immage- Objet zu.
	- Erzeugt fuer jeden Eintrag ein umschliessendes DIV - Element, weisst diesem 
	  eine Style-Classe als Attrib. zu, fuer zusaetzliche Styleangaben 
	- Erzeugt fuer jeden Eintrag ein umschliessendes DIV - Element, weisst diesem die die 
	  Carousel spezifisschen Attribute zu. 
	- Weist dem durch die Id zebergebenen Root-Elment das neue DIV-Element zu.  
 */
function appendImages(img_objects, parent_id) {
	for (let i in img_objects) {
		// Bilder (IMG) Tags bauen
		let io = img_objects[i];
		let img_elm = document.createElement("img");
		img_elm.setAttribute("src", io.name);
		img_elm.setAttribute("alt", io.alt);
		img_elm.setAttribute("class", "d-block slide-img");

		// Umschliessende DIV-Elemente bauen fue Style Manipulation  
		let img_div = document.createElement("div");
		img_div.setAttribute("class", "img-div");
		img_div.append(img_elm);
		
		// Umschliessende DIV-Elemente bauen 
		let div_elm = document.createElement("div");
		if (i == 0) {
			div_elm.setAttribute("class", "carousel-item active");
		} else {
			div_elm.setAttribute("class", "carousel-item");
		}
		// Dem DIV-Elemente das Style DIV-Eelent einhaengen 		
		div_elm.append(img_div);
		// IMG-Elemente dem unschliessenden DIV-Element hinzufuegen und ueber das Root-Elm. in den DOM Baum einhaengen 
		$(parent_id).append(div_elm);
	}
}

/**
	- Itteriert ueber eine Liste von Immage Objeketn und erstellt fuer jedes Objet ein 
	  Button-Element mit den Attributen fuer den Carousel Iindicator.
	- Hengt die Elemente in den per parent_id uebergebenen DOM-Baum.  
 */
function appendIndikators(img_objects, parent_id, target) {
	var size = img_objects.length;
	for (let i in img_objects) {
		// Buttons als Indikatoren bauen
		button = document.createElement("button");
		if (i == 0) {
			$(button).attr({
				"type": "button",
				"data-bs-target": target,
				"data-bs-slide-to": i,
				"class": "active " + get_color(i),
				"aria-current": "true",
				"aria-label": "Slide " + i
			});
		} else {
			$(button).attr({
				"type": "button",
				"data-bs-target": target,
				"data-bs-slide-to": i,
				"class": "active " + get_color(i),
				"aria-label": "Slide " + i
			});
		}
		$(parent_id).append(button);
	}
}	
/**
	Ermittelt die Farbattribute fuer die IMG-Ojekte nach Anzahl der Objekte. 
	- Giebt die entspechende Farbe zuruek, solange die Objektanzahl kleiner ist als
	  die Anzahl der Farben
	- Begint wieder bei 0, wenn die Objektanzahl fakultativ die Farobjetkanzahl ueberschreitet.
 */
function get_color(idx) {
	var size = parseInt(colors.length);
	var count = parseInt(idx);
	if (current_count >= 3) {
		current_count = 0;
		leps++;
	} else {
		count = count - (leps * size);
		current_count = count;		
	} 
	return colors[current_count].name;
}
