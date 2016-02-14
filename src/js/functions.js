/*eslint-env jquery */

$(document).ready(function(){
    $('#navbar-toggle').click(function() {
        $('#navbar-trigger').toggleClass('show');
        $('#top').toggleClass('show');
        $('#mid').toggleClass('show');
        $('#bot').toggleClass('show');
        $('#obfus').toggleClass('show');
        $('body').toggleClass('scroll');
    });

    // $('h3.toggler').click(function() {
    //     $(this).next().slideToggle(400);
    // });
});
