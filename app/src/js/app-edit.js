Polymer({
    is: 'app-edit',
    properties: {
        project: {
            type: Object
        }
    },
    observers: [
        '_viewChanged(routeData)'
    ],

    handleResponse: function (data) {
        console.log(data.detail.response);
        this.project = data.detail.response;
    },

    handleTap: function () {
        newEntrySubmit(this.$.projectForm);
    },

    _viewChanged: function(routeData) {
        var courseId = routeData.course_id;
        if(courseId == 0) {
            var loc = window.location.pathname;
            var components = loc.split("/");
            if(components.length !== 3 && components[1] !== "detail") return;
            courseId = components[2];
        }
        if (courseId == 0) {
            this.project = [
                {
                    name: "",
                    description: ""
                }
            ];
            return;
        }
        else {
            var baseUrl = "../../api_v1/index.php/projects";
            this.$.requestProjectById.url = baseUrl + '/' + courseId;
            this.$.requestProjectById.generateRequest();
        }

    }
});


function newEntrySubmit(data) {
    var xhr = new XMLHttpRequest();

    var formData = new FormData();
    var name = data.getElementsByClassName('title')[0].value;
    var desc = data.getElementsByClassName('description')[0].value;
    var contrib = data.getElementsByClassName('contributor')[0].value;

    var type = [];
    if (data.getElementsByClassName('projekt')[0].checked) {
        type.push('projekt')
    }
    if (data.getElementsByClassName('bachelor')[0].checked) {
        type.push('bachelor')
    }
    if (data.getElementsByClassName('master')[0].checked) {
        type.push('master')
    }

    var program = [];

    if (data.getElementsByClassName('Inf')[0].checked) {
        program.push('inf')
    }
    if (data.getElementsByClassName('WInf')[0].checked) {
        program.push('winf')
    }
    if (data.getElementsByClassName('EC')[0].checked) {
        program.push('EC')
    }

    var status = data.getElementsByClassName('status')[0].value;

    if (!name || !desc) {
        return
    }

    formData.append('name', name);
    formData.append('desc', desc);
    formData.append('contributor', contrib);
    formData.append('type', type);
    formData.append('program', program);
    formData.append('status', status);


    console.log(formData);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(xhr.response)
        }
    };
    console.log(data.getElementsByClassName('title')[0].value);
    if (window.location.pathname.split('/')[2] != 0) {
        xhr.open("POST", "../../api_v1/index.php/projects/" + window.location.pathname.split('/')[2]);
    }
    else {
        xhr.open("POST", "../../api_v1/index.php/projects");
    }

    xhr.setRequestHeader("Authorization", "Bearer " + jwt_token);
    xhr.send(formData);
}

