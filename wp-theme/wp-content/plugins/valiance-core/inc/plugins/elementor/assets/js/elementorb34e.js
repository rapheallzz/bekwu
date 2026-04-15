(function ( $ ) {
	'use strict';

	$( window ).on(
		'elementor/frontend/init',
		function () {
			// shortcodes
			qodefElementorShortcodes.init();

			// section extension
			qodefElementorSection.init();
			elementorSection.init();
		}
	);

	// shortcodes
	var qodefElementorShortcodes = {
		init: function () {
			var isEditMode = Boolean( elementorFrontend.isEditMode() );

			if ( isEditMode ) {
				for ( var key in qodefCore.shortcodes ) {
					for ( var keyChild in qodefCore.shortcodes[key] ) {
						qodefElementorShortcodes.reInitShortcode(
							key,
							keyChild
						);
					}
				}
			}
		},
		reInitShortcode: function ( key, keyChild ) {
			elementorFrontend.hooks.addAction(
				'frontend/element_ready/' + key + '.default',
				function ( e ) {

					// check if object doesn't exist and print the module where is the error
					if ( typeof qodefCore.shortcodes[key][keyChild] === 'undefined' ) {
						console.log( keyChild );
					} else if ( typeof qodefCore.shortcodes[key][keyChild].initSlider === 'function' && e.find( '.qodef-instagram-swiper-container' ).length ) {
						qodefCore.shortcodes[key][keyChild].initSlider(
							e.find( '.qodef-instagram-swiper-container' ),
							false
						);
					} else if ( typeof qodefCore.shortcodes[key][keyChild].initSlider === 'function' && e.find( '.qodef-swiper-container' ).length ) {
						qodefCore.shortcodes[key][keyChild].initSlider( e.find( '.qodef-swiper-container' ) );
					} else if ( typeof qodefCore.shortcodes[key][keyChild].initPopup === 'function' && e.find( '.qodef-magnific-popup' ).length ) {
						qodefCore.shortcodes[key][keyChild].initPopup( e.find( '.qodef-magnific-popup' ) );
					} else if ( typeof qodefCore.shortcodes[key][keyChild].initItem === 'function' && e.find( '.qodef-shortcode' ).length ) {
						qodefCore.shortcodes[key][keyChild].initItem( e.find( '.qodef-shortcode' ) );
					} else {
						qodefCore.shortcodes[key][keyChild].init();
					}
				}
			);
		}
	};

	var qodefElementorSection = {
		init: function () {
			$( window ).on(
				'elementor/frontend/init',
				function () {
					elementorFrontend.hooks.addAction(
						'frontend/element_ready/section',
						elementorSection.init
					);
				}
			);
		}
	};

	var elementorSection = {
		init: function ( $scope ) {
			var $target     = $scope,
				isEditMode  = Boolean( elementorFrontend.isEditMode() ),
				settings    = [],
				sectionData = {};

			//generate parallax settings
			if ( isEditMode && typeof $scope !== 'undefined' ) {

				// generate options when in admin
				var editorElements = window.elementor.elements,
					sectionId      = $target.data( 'id' );

				$.each(
					editorElements.models,
					function ( index, object ) {
						if ( sectionId === object.id ) {
							sectionData = object.attributes.settings.attributes;
						}
					}
				);

				//parallax options
				if ( typeof sectionData.qodef_parallax_type !== 'undefined' ) {
					settings['enable_parallax'] = sectionData.qodef_parallax_type;
				}

				if ( typeof sectionData.qodef_parallax_image !== 'undefined' && sectionData.qodef_parallax_image['url'] ) {
					settings['parallax_image_url'] = sectionData.qodef_parallax_image['url'];
				}

				// offset options
				if ( typeof sectionData.qodef_offset_type !== 'undefined' ) {
					settings['enable_offset'] = sectionData.qodef_offset_type;
				}

				if ( typeof sectionData.qodef_offset_image !== 'undefined' && sectionData.qodef_offset_image['url'] ) {
					settings['offset_image_url'] = sectionData.qodef_offset_image['url'];
				}

				if ( typeof sectionData.qodef_offset_parallax !== 'undefined' ) {
					settings['offset_parallax'] = sectionData.qodef_offset_parallax;
				}

				if ( typeof sectionData.qodef_offset_vertical_anchor !== 'undefined' ) {
					settings['offset_vertical_anchor'] = sectionData.qodef_offset_vertical_anchor;
				}

				if ( typeof sectionData.qodef_offset_vertical_position !== 'undefined' ) {
					settings['offset_vertical_position'] = sectionData.qodef_offset_vertical_position;
				}

				if ( typeof sectionData.qodef_offset_horizontal_anchor !== 'undefined' ) {
					settings['offset_horizontal_anchor'] = sectionData.qodef_offset_horizontal_anchor;
				}

				if ( typeof sectionData.qodef_offset_horizontal_position !== 'undefined' ) {
					settings['offset_horizontal_position'] = sectionData.qodef_offset_horizontal_position;
				}

				if ( typeof sectionData.qodef_offset_subtitle !== 'undefined' ) {
					settings['offset_subtitle'] = sectionData.qodef_offset_subtitle;
				}

				if ( typeof sectionData.qodef_offset_title !== 'undefined' ) {
					settings['offset_title'] = sectionData.qodef_offset_title;
				}

				if ( typeof sectionData.qodef_offset_button_link !== 'undefined' ) {
					settings['offset_button_link'] = sectionData.qodef_offset_button_link;
				}

				//generate output backend
				if ( typeof $target !== 'undefined' ) {
					elementorSection.generateOutput(
						$target,
						settings
					);
				}
			} else {

				// generate options when in frontend using global js variable
				var sectionHandlerData = qodefElementorGlobal.vars.elementorSectionHandler;

				$.each(
					sectionHandlerData,
					function ( index, properties ) {

						properties.forEach( function ( property ) {

							if ( typeof property['parallax_type'] !== 'undefined' && property['parallax_type'] === 'parallax' ) {

								$target                        = $( '[data-id="' + index + '"]' );
								settings['parallax_type']      = property['parallax_type'];
								settings['parallax_image_url'] = property['parallax_image']['url'];

								if ( typeof settings['parallax_image_url'] !== 'undefined' ) {
									settings['enable_parallax'] = 'parallax';
								}
							}

							if ( typeof property['offset_type'] !== 'undefined' && property['offset_type'] === 'offset' ) {

								$target                                = $( '[data-id="' + index + '"]' );
								settings['offset_type']                = property['offset_type'];
								settings['offset_image_url']           = property['offset_image']['url'];
								settings['offset_parallax']            = property['offset_parallax'];
								settings['offset_vertical_anchor']     = property['offset_vertical_anchor'];
								settings['offset_vertical_position']   = property['offset_vertical_position'];
								settings['offset_horizontal_anchor']   = property['offset_horizontal_anchor'];
								settings['offset_horizontal_position'] = property['offset_horizontal_position'];
								settings['offset_subtitle']            = property['offset_subtitle'];
								settings['offset_title']               = property['offset_title'];
								settings['offset_button_link']         = property['offset_button_link'];

								if ( typeof settings['offset_image_url'] !== 'undefined' ) {
									settings['enable_offset'] = 'offset';
								}
							}

							//generate output frontend
							if ( typeof $target !== 'undefined' ) {
								elementorSection.generateOutput(
									$target,
									settings
								);

								settings = [];
							}
						} );
					}
				);
			}
		},
		generateOutput: function ( $target, settings ) {

			if ( typeof settings['enable_parallax'] !== 'undefined' && settings['enable_parallax'] === 'parallax' && typeof settings['parallax_image_url'] !== 'undefined' ) {

				$(
					'.qodef-parallax-row-holder',
					$target
				).remove();
				$target.removeClass( 'qodef-parallax qodef--parallax-row' );

				var $layout = null;

				$target.addClass( 'qodef-parallax qodef--parallax-row' );

				$layout = $( '<div class="qodef-parallax-row-holder"><div class="qodef-parallax-img-holder"><div class="qodef-parallax-img-wrapper"><img class="qodef-parallax-img" src="' + settings['parallax_image_url'] + '" alt="Parallax Image"></div></div></div>' ).prependTo( $target );

				// wait for image src to be loaded
				var newImg    = new Image;
				newImg.onload = function () {
					$target.find( 'img.qodef-parallax-img' ).attr(
						'src',
						this.src
					);
					qodefCore.qodefParallaxBackground.init();
				};
				newImg.src    = settings['parallax_image_url'];
			}

			if ( typeof settings['enable_offset'] !== 'undefined' && settings['enable_offset'] === 'offset' && typeof settings['offset_image_url'] !== 'undefined' ) {

				$(
					'.qodef-offset-image-holder',
					$target
				).remove();
				$target.removeClass( 'qodef-offset-image' );

				var $parallaxClass = '';
				if ( typeof settings['offset_parallax'] !== 'undefined' && settings['offset_parallax'] === 'yes' ) {
					$parallaxClass = ' qodef-parallax-item';
				}

				var $layout = null;

				$target.addClass( 'qodef-offset-image' );

				$layout = $( '<div class="qodef-offset-image-holder" style="position: absolute; z-index: 5; ' + settings['offset_vertical_anchor'] + ':' + settings['offset_vertical_position'] + ';' + settings['offset_horizontal_anchor'] + ':' + settings['offset_horizontal_position'] + '"><div class="qodef-offset-image-wrapper' + $parallaxClass + '"><img src="' + settings['offset_image_url'] + '" alt="Offset Image"><div class="qodef-offset-text-wrapper"><p class="qodef-offset-subtitle">' + settings['offset_subtitle'] + '</p><h3 class="qodef-offset-title">' + settings['offset_title'] + '</h3><a class="qodef-shortcode qodef-m qodef-button qodef-layout--simple qodef-html--link" href="' + settings['offset_button_link'] + '" target="blank"><span class="qodef-m-icon-arrow qodef-m-icon-arrow1"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="7" viewBox="0 0 36 7"><line x1="30" style="stroke:currentColor" transform="translate(0 3.5)" stroke-width="1"></line><path d="M3.5,0,7,6H0Z" transform="translate(36) rotate(90)"></path></svg></span><span class="qodef-m-icon-arrow qodef-m-icon-arrow2"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="7" viewBox="0 0 36 7"><line x1="30" style="stroke:currentColor" transform="translate(0 3.5)" stroke-width="1"></line><path d="M3.5,0,7,6H0Z" transform="translate(36) rotate(90)"></path></svg></span><svg class="qodef-svg-light" x="0px" y="0px" width="51px" height="51px" viewBox="39.278 38.5 51 51" enable-background="new 39.278 38.5 51 51" xml:space="preserve"><circle fill="none" stroke="#BEBEBD" stroke-miterlimit="10" cx="64.778" cy="64" r="25"></circle></svg><svg class="qodef-svg-dark" x="0px" y="0px" width="51px" height="51px" viewBox="39.278 38.5 51 51" enable-background="new 39.278 38.5 51 51" xml:space="preserve"><circle fill="none" stroke="currentColor" stroke-miterlimit="10" cx="64.778" cy="64" r="25"></circle></svg></a></div></div></div>' ).prependTo( $target );

			}
		}
	};

})( jQuery );
