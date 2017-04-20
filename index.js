var $target = document.getElementById( "import-target" );
var $rendered = document.getElementById( "import-rendered" );

function setHtml( html ) {
	var escape = document.createElement( "textarea" );
	escape.textContent = html;

	$target.innerHTML = escape.innerHTML;

	hljs.highlightBlock( $target );

	$rendered.innerHTML = html;

	sync();
}

function getHtml( url ) {
	fetch( URL )
		.then(function (response) {
			return response.text();
		}).then(function (text) {
			setHtml( text );
		}).catch(function( error ) {
			console.error( 'Looks like there was a problem. ', error );
		});
}

function sync() {
	var opened = -1;
	var unclosed = [];
	var lastNode;

	$target.querySelectorAll( ".hljs-tag" ).forEach(function( node ) {
		if( node.textContent.indexOf( "</" ) === -1 ) {
			opened++;
			unclosed.push( opened );

			node.classList.add( "start-tag" );
			node.setAttribute( "data-tagindex", opened );
		} else {
			node.classList.add( "end-tag" );
			node.setAttribute( "data-tagindex", unclosed.pop() );
		}
	});

	var index = 0;
	$rendered.querySelectorAll( "*" ).forEach(function( node ) {
		node.setAttribute( "data-tagindex", index++ );
	});
}

function selectNodes( value ) {
	document.querySelectorAll( ".match" ).forEach(function( node ) {
		node.classList.remove( "match" );
	});

	var matchCount = 0;
	if( value ) {
		try {
			var matches = [];
			$rendered.querySelectorAll( value ).forEach(function( node ) {
				matches.push( "[data-tagindex='" + node.getAttribute( "data-tagindex" ) + "']" );
				$target.querySelectorAll( matches.join( "," ) ).forEach(function( highlightedNode ) {
					highlightedNode.classList.add( "match" );
				});
				matchCount++;
				node.classList.add( "match" );
			});

		} catch( e ) {
			// uhhh
		}
	}

	// update count
	document.getElementById( "selector-count" ).innerHTML = matchCount + " match" + ( matchCount !== 1 ? "es" : "" );
}

document.getElementById( "selector-input" ).addEventListener( "input", function( e ) {
	selectNodes( e.target.value );
}, false );

document.getElementById( "sourcecode-wrap" ).addEventListener( "change", function( e ) {
	document.getElementById( "source-code" ).classList.toggle( "sourcecode-wrap" );
}, false );

const URL = "demo-table.html";
getHtml( URL );