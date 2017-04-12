(function() {
    'use strict';

    window.jobs = window.jobs || {};
    window.jobs.saveJob = saveJob;
    window.jobs.removeJob = removeJob;
    window.jobs.getJobs = getJobs;
    window.jobs.getJob = getJob;

    /**
     * Saves a single job by making an API call.
     *
     * @param  {Object} data All required job data: {company, link}
     * @return {Promise}     jQuery XHR Promise
     */
    function saveJob(data) {
        if (!data || !data.company || !data.link) {
            var def = $.Deferred();
            def.reject('Please provide a valid company and link to create a job.');
            return def.promise();
        }

        return $.ajax({
            url: '/api/jobs',
            method: 'post',
            data: JSON.stringify(data),
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Deletes a job from the database (using the API)
     *
     * @param  {String} id   The ID of the job to delete
     * @return {Promise}     jQuery XHR Promise
     */
    function removeJob(id) {
        if (!id) {
            var def = $.Deferred();
            def.reject('Please provide a valid id to delete a job.');
            return def.promise();
        }

        return $.ajax({
            url: '/api/jobs/' + id,
            method: 'delete',
            dataType: 'json'
        });
    }

    /**
     * Retreives all jobs in the database (using the API)
     *
     * @return {Promise}     jQuery XHR Promise
     */
    function getJobs(query) {
        let options = {
            url: '/api/jobs',
            method: 'get',
            dataType: 'json'
        };

        if (query) {
            options.data = { query: query };
        }

        return $.ajax(options);
    }

    /**
     * Retrieves a job from the database (using the API)
     *
     * @param  {String} id   The ID of the job to retrieve
     * @return {Promise}     jQuery XHR Promise
     */
    function getJob(id) {
        if (!id) {
            var def = $.Deferred();
            def.reject('Please provide a valid id to retrieve a single job.');
            return def.promise();
        }

        return $.ajax({
            url: '/api/jobs/' + id,
            method: 'get',
            dataType: 'json'
        });
    }


    /*
        This section is here to allow testing without the server. You would
        typically NOT want this in your source code, that would be very bad
        practice.
     */
    if (window.location.search === '?test') {
        console.log('loading mock endpoints');
        $.mockjax({
            url: '/api/jobs',
            type: 'post',
            response: function (settings) {
                let data = JSON.parse(settings.data);
                let id = Math.ceil(Math.random() * 10000);
                this.status = 201;
                this.responseText = {
                    id: ''+id,
                    company: data.company,
                    link: data.link,
                    notes: data.notes || null,
                    createTime: Date.now()
                };
            }
        });
        $.mockjax({
            url: /^\/api\/jobs\/([a-f0-9]+)/i,
            urlParams: ['id'],
            type: 'delete',
            response: function (settings) {
                this.status = 200;
                this.responseText = {
                    id: settings.urlParams.id,
                    company: 'Foobar, inc',
                    link: 'http://foobar.com',
                    notes: 'Love this place!'
                };
            }
        });
        $.mockjax({
            url: '/api/jobs',
            type: 'get',
            response: function() {
                let data = [];
                for (let i=0; i<10; i++) {
                    let id = Math.ceil(Math.random() * 10000);
                    data.push(
                        { id: id, company: 'Foobar' + id, link: 'http://foobar.com' }
                    );
                }
                this.responseText = data;
            }
        });
        $.mockjax({
            url: /^\/api\/jobs\/([a-f0-9]+)/i,
            urlParams: ['id'],
            type: 'get',
            response: function (settings) {
                this.status = 200;
                this.responseText = {
                    id: settings.urlParams.id,
                    company: 'Foobar' + settings.urlParams.id,
                    link: 'http://foobar.com',
                    notes: ((Math.random() > 0.5) ? null : 'This place is great!'),
                    createTime: Date.now() - (Math.ceil(Math.random() * (86400000 * 30)))
                };
            }
        });
    }

})();
