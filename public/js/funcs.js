/**
 * Created by Al on 11/06/2015.
 */
jQuery(document).ready(function () {


    //stick in the fixed 100% height behind the navbar but don't wrap it
    jQuery('#slide-nav.navbar .container').append(jQuery('<div id="navbar-height-col"></div>'));

    // Enter your ids or classes
    var toggler = '.navbar-toggle';
    var pagewrapper = '#page-content';
    var navigationwrapper = '.navbar-header';
    var menuwidth = '100%'; // the menu inside the slide menu itself
    var slidewidth = '80%';
    var menuneg = '-100%';
    var slideneg = '-80%';


    jQuery("#slide-nav").on("click", toggler, function (e) {

        var selected = jQuery(this).hasClass('slide-active');

        jQuery('#slidemenu').stop().animate({
            left: selected ? menuneg : '0px'
        });

        jQuery('#navbar-height-col').stop().animate({
            left: selected ? slideneg : '0px'
        });

        jQuery(pagewrapper).stop().animate({
            left: selected ? '0px' : slidewidth
        });

        jQuery(navigationwrapper).stop().animate({
            left: selected ? '0px' : slidewidth
        });


        jQuery(this).toggleClass('slide-active', !selected);
        jQuery('#slidemenu').toggleClass('slide-active');


        jQuery('#page-content, .navbar, body, .navbar-header').toggleClass('slide-active');


    });


    var selected = '#slidemenu, #page-content, body, .navbar, .navbar-header';


    jQuery(window).on("resize", function () {

        if (jQuery(window).width() > 767 && jQuery('.navbar-toggle').is(':hidden')) {
            jQuery(selected).removeClass('slide-active');
        }


    });




});