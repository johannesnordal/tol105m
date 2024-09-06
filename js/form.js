window.addEventListener("load", (event) => {
    $.getJSON("data/form-schema.json", init);
});

function init(json_config) {
    // Default html container name for fields
    defaultFieldPosition = $("#formFields")

    //
    // Set up the form dynamically with all fields from the
    // LAMEC configuration
    // 
    $.each(json_config.fields, function(key, field) {
        //
        // Add the header for the field, containing the field name
        // and a description of the field
        //
        addFieldHeaderElement(field.name, field.desc);

        //
        // Add an empty field element as specified in the JSON data.
        // Check for the special case where field type is string, but there is
        // a restriction of type 'option', in that case the field is SELECT.
        //
        fieldType = field.type;
        if(fieldType == 'string' && field.restriction && field.restriction.type == 'option') {
            fieldType = 'select';
        }
        addFieldElement(field.name, fieldType);

        //
        // Process the settings for the field that was created above and add
        // the settings as a data attribute to each form field for later use.
        //
        if(field.restriction) {
            $("#" + field.name).data("restriction", field.restriction);
        }
        if(field.scope) {
            $("#" + field.name).data("scope", field.scope);
        }
        if(field.default) {
            $("#" + field.name).data("default", field.default);
        }

        //
        // Check if there is documentation available for this field, and if there is then
        // add it as a data attribute to the relevant form field for later reference,
        // then add the html element.
        //
        if(json_config.documentation && json_config.documentation[field.name]) {
            $("#" + field.name).data("documentation", json_config.documentation[field.name]);
            addDocumentationElement(field.name);
        }

        //
        // Process this field's data and update the form element accordingly,
        // taking into account all restrictions, dependencies and scope.
        //
        setFieldAttributes(field.name);
    });


    //
    // Adds the html header for a field.
    //
    function addFieldHeaderElement(fieldName, fieldDescription, fieldPosition = defaultFieldPosition) {
        new_field = '<div class="mt-4" ';
        new_field += 'id="' + fieldName + 'Header" ';
        new_field += '><label for="';
        new_field += fieldName;
        new_field += '" class="form-label"><b>';
        new_field += fieldName[0].toUpperCase() + fieldName.slice(1).replace(/_/g, ' ');
        new_field += '</b></label><div id="';
        new_field += fieldName;
        new_field += 'Help" class="form-text mt-0 mb-1">';
        new_field += fieldDescription;
        new_field += '</div></div>';
        fieldPosition.append(new_field);
    }

    //
    // Adds an empty field element.
    //
    function addFieldElement(fieldName, fieldType, fieldPosition = defaultFieldPosition) {
        new_field = '<div class="my-0" ';
        new_field += 'id="' + fieldName + 'Element">';
        if(fieldType == 'select') {
            new_field += '<select class="form-select" ';
        }
        else if(fieldType == 'number') {
            new_field += '<input class="form-control" type="number" ';
        }
        else if(fieldType == 'string') {
            new_field += '<input class="form-control" type="text" ';
        }

        new_field += 'id="' + fieldName + '" ';
        new_field += 'name="' + fieldName + '" ';
        new_field += 'aria-describedby="' + fieldName + 'Help" >';

        if(fieldType == 'select') {
            new_field += '</select>';
        }
        new_field += '</div>';
        fieldPosition.append(new_field);
    }

    //
    // Add an html documentation element.
    //
    function addDocumentationElement(fieldName, fieldPosition = defaultFieldPosition) {
        new_field = '<div class="mt-1 mb-0" id="' + fieldName + '-documentation">';
        new_field += '<small class="text-body-secondary">';
        new_field += '<span id="' + fieldName + '-name"></span> ';
        new_field += '<a id="' + fieldName + '-documentation-url" href="#" target="_blank">documentation</a> ';
        new_field += '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">';
        new_field += '<path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>';
        new_field += '<path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>';
        new_field += '</svg></small></div>';
        fieldPosition.append(new_field);
    }

    //
    // Process the field's data and update the form element accordingly,
    // taking into account all restrictions, dependencies and scope.
    //
    function setFieldAttributes(fieldName) {
        fieldElement = $("#" + fieldName);

        if(fieldElement.data("scope")) {
            //
            // The field has a specific scope, show or hide
            // the field accordingly.
            //
            if(isFieldWithinScope(fieldElement.data("scope"))) {
                $("#" + fieldName + "Header").show();
                $("#" + fieldName + "Element").show();
            }
            else {
                $("#" + fieldName + "Header").hide();
                $("#" + fieldName + "Element").hide();						
            }
        }

        restriction = fieldElement.data("restriction");
        if(restriction) {
            //
            // Process the field's restrictions.
            //
            restrictionType = restriction.type;

            //
            // The field is a select field, delete all options present
            // and then repopulate the field, taking into account restrictions
            // and dependencies.
            //
            if(restrictionType == 'option') {
                $("#" + fieldName).length = 0;
            }

            if(restriction.value.depends_on) {
                dependantFields = restriction.value.depends_on.fields;
                dependantResolution = restriction.value.depends_on.resolution;

                $.each(dependantResolution, function(index, resolution) {
                    // Track the number of resolutions that are met
                    resolutionCount = 0;
                    for(i=0; i<resolution.key.length; i++) {
                        if(resolution.key[i] == document.getElementById(dependantFields[i]).value) {
                            // one resolution met
                            resolutionCount++;
                        }
                        else {
                            // a resolution not met, skip to next
                            // continue
                            return(true);
                        }
                    }

                    if(resolutionCount == i) {
                        // All dependant resolutions met
                        if(restrictionType == 'range') {
                            fieldElement.attr("min", resolution.value[0]);
                            fieldElement.attr("max", resolution.value[1]);
                            fieldElement.val(resolution.value[0]);
                        }
                        else if(restrictionType == 'option') {
                            populateFieldElementOptions(fieldName, resolution.value);
                        }
                        // As all resolutions were met, no need to search further.
                        // break
                        return(false);
                    }
                });
            }
            else {
                if(restrictionType == 'option') {
                    populateFieldElementOptions(fieldName, restriction.value);
                }
                else if (restrictionType == 'range'){
                    fieldElement.attr("min", restriction.value[0]);
                    fieldElement.attr("max", restriction.value[1]);
                    fieldElement.val(restriction.value[0]);
                }
            }
        }

        // Set defaut field value, if defined.
        if(fieldElement.data("default")) {
            fieldElement.val(fieldElement.data("default"));
        }

        if(fieldElement.data("documentation")) {
            // Show documentation if selected option has documentation available
            updateDocumentation(fieldName);
        }
    }

    //
    // Method to update link to documentation for selected option
    //
    function updateDocumentation(fieldName) {
        let documentationFound = false;
        $.each($("#" + fieldName).data("documentation"), function(key, val) {
            if(document.getElementById(fieldName).value == key) {
                $("#" + fieldName + "-name").text(key);
                $("#" + fieldName + "-documentation-url").attr("href", val);
                documentationFound = true;
                // break
                return(false);
            }
        });
        if(documentationFound) {
            $("#" + fieldName + "-documentation").show();
        }
        else {
            $("#" + fieldName + "-documentation").hide();
        }
    }

    //
    // Method to pupolate the options of a select element
    //
    function populateFieldElementOptions(fieldName, fieldValues) {
        sel_element = document.getElementById(fieldName);
        sel_element.length = 0;
        $.each(fieldValues, function(key, val) {
            sel_element.options[sel_element.options.length] = new Option(val, val);
        });
    }

    //
    // Method to check if a field is within scope.
    //
    function isFieldWithinScope(fieldScope) {
        let isWithinScope = false;
        if(fieldScope) {
            $.each(fieldScope, function(key, scope) {
                $.each(scope.values, function(key, vals) {
                    let matchedVals = 0;
                    for(i = 0; i < vals.length; i++) {
                        if(vals[i] == document.getElementById(scope.fields[i]).value) {
                            matchedVals++;
                        }
                        else {
                            continue;
                        }
                    }
                    if(matchedVals == vals.length) {
                        isWithinScope = true;
                        return(false);
                    }
                })
            });
            return(isWithinScope);
        }
        return(false);
    }

    //
    // Catch all changes to select elements and update other fields accordingly,
    // based on the rules of dependencies, scope and available documentation
    //
    $(".form-select").on('change', function() {
        changedField = this.name;

        // If field has documentation data, then it needs updating
        if($("#" + changedField).data("documentation")) {
            updateDocumentation(changedField);
        }

        $.each(json_config.fields, function(key, field) {
            if(field.scope) {
                setFieldAttributes(field.name);
            }
            else if(field.restriction && field.restriction.value && field.restriction.value.depends_on) {
                $.each(field.restriction.value.depends_on.fields, function(key, val) {
                    if(val == changedField) {
                        // Update the field, according to set dependencies
                        setFieldAttributes(field.name);
                    }
                });
            }
        });

    });
}
