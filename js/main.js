function BadgePressed() {
    $("a#" + this.id).toggleClass("down");

    $('.project-label').each(function(index) {
        var projectId = this.getAttribute("for");
        var foundLabelStillActive = false;
        $('.project-label').each(function(index) {
            if (this.getAttribute("for") == projectId && !($(this).hasClass("down"))) {
                foundLabelStillActive = true;
            }
        });

        var hasClass = $("#" + projectId).hasClass("project-hidden");
        if (hasClass && foundLabelStillActive) {
            $("#" + projectId).removeClass("project-hidden");
        } else {
            if (!hasClass && !foundLabelStillActive) {
                $("#" + projectId).addClass("project-hidden");
            }
        }
    });
}

function AllBadgePressed() {
    $('.project-label').each(function(index) {
        if ($(this).hasClass("down")) {
            $(this).removeClass("down");
            var projectId = this.getAttribute("for");
            var hasClass = $("#" + projectId).hasClass("project-hidden");
            if (hasClass) {
                $("#" + projectId).removeClass("project-hidden");
            }
        }
    });
}

function NoneBadgePressed() {
    $('.project-label').each(function(index) {
        if (!$(this).hasClass("down")) {
            $(this).addClass("down");
            var projectId = this.getAttribute("for");
            var hasClass = $("#" + projectId).hasClass("project-hidden");
            if (!hasClass) {
                $("#" + projectId).addClass("project-hidden");
            }
        }
    });
}

$(document).ready(function() {
    $('.project-label').click(BadgePressed);
    $('#project-label-all').click(AllBadgePressed);
    $('#project-label-none').click(NoneBadgePressed);
    LoadProjectsFromJson(projectSettings);
});

function LoadProjectsFromJson(projectSettings) {

    // First build up the new CSS classes for badge button colours
    var newCss = "";
    for (i = 0; i < projectSettings.labels.length; i++) {
        var newLabel = projectSettings.labels[i];
        var includeWhite = "";
        if (newLabel.is_label_font_white) {
            includeWhite = "color: white !important;"
        }
        newCss = newCss + " .proj-label-" + newLabel.id + " { background-color: " + newLabel.hex_color + "; " + includeWhite + " }  .proj-label-" + newLabel.id + ":hover { background-color: " + newLabel.hex_hover_color + "; } ";
    }
    var style = document.createElement('style');
    if (style.styleSheet) {
        style.styleSheet.cssText = newCss;
    } else {
        style.appendChild(document.createTextNode(newCss));
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    // Then add new badge buttons to top of page
    for (i = 0; i < projectSettings.labels.length; i++) {
        var newLabel = projectSettings.labels[i];
        var badge = document.createElement("a");
        var badgeText = document.createTextNode(newLabel.display_name);
        badge.appendChild(badgeText);
        badge.id = "label-" + newLabel.id;
        badge.classList.add("project-label");
        badge.classList.add("proj-label-" + newLabel.id);
        $(badge).click(BadgePressed);
        document.getElementById("label-container").appendChild(badge);
    }

    // Then add projects
    for (i = 0; i < projectSettings.projects.length; i++) {
        var newProject = projectSettings.projects[i];
        // Create div containing project
        var bigParent = document.createElement("div");
        bigParent.classList.add("project");
        bigParent.classList.add("col-12");
        bigParent.classList.add("col-xl-6");
        bigParent.id = newProject.id;
        var parent = document.createElement("div");
        parent.classList.add("project-block");
        bigParent.appendChild(parent);
        if (!newProject.icon) {
            // Create a containing title
            var title = document.createElement("a");
            title.href = newProject.title_link;
            title.setAttribute("target", "_blank");
            title.classList.add("project-title");
            var titleContent = document.createTextNode(newProject.display_name);
            title.appendChild(titleContent);
            parent.appendChild(title);
            // Create div containing links
            var linksParent = document.createElement("div");
            linksParent.classList.add("proj-small-link-parent");
            for (j = 0; j < newProject.links.length; j++) {
                var newLink = newProject.links[j];
                var link = document.createElement("a");
                link.href = newLink.url;
                link.setAttribute("target", "_blank");
                link.classList.add("proj-small-link");
                var linkContent = document.createTextNode(newLink.display_name);
                link.appendChild(linkContent);
                linksParent.appendChild(link);
            }
            parent.appendChild(linksParent);
        } else {
            // do same with icon
            var horizFlex = document.createElement("div");
            horizFlex.classList.add("project-title-flex-container");
            var image = document.createElement("img");
            image.setAttribute("src", newProject.icon);
            image.classList.add("project-icon");
            image.setAttribute("width", "48");
            image.setAttribute("height", "48");
            horizFlex.appendChild(image);
            var titleDiv = document.createElement("div");
            // Create a containing title
            var title = document.createElement("a");
            title.href = newProject.title_link;
            title.setAttribute("target", "_blank");
            title.classList.add("project-title");
            var titleContent = document.createTextNode(newProject.display_name);
            title.appendChild(titleContent);
            titleDiv.appendChild(title);
            // Create div containing links
            var linksParent = document.createElement("div");
            linksParent.classList.add("proj-small-link-parent");
            for (j = 0; j < newProject.links.length; j++) {
                var newLink = newProject.links[j];
                var link = document.createElement("a");
                link.href = newLink.url;
                link.setAttribute("target", "_blank");
                link.classList.add("proj-small-link");
                var linkContent = document.createTextNode(newLink.display_name);
                link.appendChild(linkContent);
                linksParent.appendChild(link);
            }
            titleDiv.appendChild(linksParent);

            horizFlex.appendChild(titleDiv);
            parent.appendChild(horizFlex);
        }
        // Create p containing description
        var description = document.createElement("a");
        description.classList.add("project-text");
        var descriptionContent = document.createTextNode(newProject.description);
        description.appendChild(descriptionContent);
        parent.appendChild(description);
        // Create div containing label badges
        var badgeParent = document.createElement("div");
        badgeParent.classList.add("label-container");
        for (j = 0; j < newProject.labels.length; j++) {
            var labelId = newProject.labels[j];
            var label;
            var labelFound = false;
            for (k = 0; k < projectSettings.labels.length; k++) {
                if (projectSettings.labels[k].id == labelId) {
                    labelFound = true;
                    label = projectSettings.labels[k];
                    break;
                }
            }
            if (labelFound) {
                var labelLink = document.createElement("a");
                var content = document.createTextNode(label.display_name);
                labelLink.appendChild(content);
                labelLink.id = "label-" + labelId;
                labelLink.setAttribute("for", newProject.id);
                labelLink.classList.add("project-label");
                labelLink.classList.add("proj-label-" + labelId);
                $(labelLink).click(BadgePressed);
                badgeParent.appendChild(labelLink);
            }
        }
        parent.appendChild(badgeParent);
        // Add project to html
        document.getElementById("projects-parent").appendChild(bigParent);
    }
}
