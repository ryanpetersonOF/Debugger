

document.addEventListener('DOMContentLoaded', function () {
	//OpenFin is ready
	fin.desktop.main(function () {
		var dbr = new Debugger();
	});
	
	$(".close-x").click(function () {
			fin.desktop.Application.getCurrent().close();
	});

	$(".minimize").click(function () {
			fin.desktop.Window.getCurrent().minimize();
	});
	
	

	$(".hamburger").click(function (event) {
			event.stopPropagation();
			if (dropped) {
					$(".hamburger-dropdown").removeClass("hamburger-dropdown-show");
					dropped = false;
			} else {
					$(".hamburger-dropdown").addClass("hamburger-dropdown-show");
					dropped = true;
			}
	});

	$("body").click(function () {
			$(".hamburger-dropdown").removeClass("hamburger-dropdown-show");
			dropped = false;
	})
});
