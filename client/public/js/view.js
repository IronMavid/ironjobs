(function() {
    'use strict';

    window.jobs = window.jobs || {};

    let $jobs = $('.jobs');
    let $msg = $('.message');
    let $modalCover = $('.modal-cover');
    let $modalElem = $('.modal');
    let $searchForm = $('.search');
    let $searchQuery = $searchForm.find('[name="query"]');

    $('.add-job').submit(addJob);
    $searchForm.submit(searchJobs);
    $jobs.on('click', '.show-detail', showJobDetail);
    $modalElem.on('click', '.close', closeModal);
    $jobs.on('click', '.delete', removeJob);
    $('.search-icon').click(toggleSearchForm);

    $(function() {
        window.jobs.getJobs()
            .then(function(jobs) {
                $jobs.html('');
                jobs.forEach(showJob);
            })
            .catch(function(xhr) {
                showError(`Unable to load jobs (${xhr.status})`);
            });
    });


    function addJob(e) {
        e.preventDefault();
        clearMessage();

        let data = {};
        $(this).serializeArray().forEach(function transformFormData(field) {
            data[field.name] = field.value;
        });
        if (!data.company || !data.link) {
            return showError('Please enter both a company and link to add a job!');
        }
        window.jobs.saveJob(data)
            .then(function handleSave(job) {
                console.log(arguments);
                showSuccess('Your job has been added!');
                showJob(job);
            })
            .catch(function handleErr(xhr) {
                showError(`Unable to save data (${xhr.status})`);
            });
    }

    function removeJob(e) {
        e.preventDefault();
        let id = $(this).closest('article').data('id');
        if (!id) {
            return showError('Unable to determine ID for job, can you refresh the page and try again?');
        }
        window.jobs.removeJob(id)
            .then(function removeJobHtml() {
                $(`[data-id="${id}"]`).parent().remove();
                showSuccess('Job deleted successfully!');
            })
            .catch(function showRemoveError(xhr) {
                showError(`Unable to remove job (${xhr.status})`);
            });
    }

    function showJobDetail(e) {
        e.preventDefault();
        let id = $(this).closest('article').data('id');
        window.jobs.getJob(id)
            .then(showDetailModal)
            .catch(function detailError(xhr) {
                showError(`Unable to retrieve job detail (${xhr.status})`);
            });
    }


    function showDetailModal(data) {
        let url = (/^http/.test(data.link)) ? data.link : ('mailto:' + data.link);
        let jobDate = new Date(data.createTime);
        jobDate = `${jobDate.getMonth() + 1}/${jobDate.getDate()}/${jobDate.getFullYear()}`;

        $modalCover.height($(document).height()).show();
        $modalElem
            .css('top', (window.innerHeight * 0.35) + window.scrollY)
            .show()
            .find('article')
                .html(`
                    <h4>${data.company}</h4>
                    <p><a href='${url}'>${data.link}</a></p>
                    <p><strong>Notes:</strong> ${data.notes || 'none'}</p>
                    <p>
                        Post #${data.id} created on ${jobDate}
                    </p>
                `);
    }

    function toggleSearchForm(e) {
        e.preventDefault();
        let right = parseInt($searchForm.css('right'), 10);
        if (right < 0) {
            $searchForm.css('right', '1.5em');
        } else {
            $searchForm.css('right', '-23.5em');
        }
    }

    function searchJobs(e) {
        e.preventDefault();
        let query = $searchQuery.val() || null;

        window.jobs.getJobs(query)
            .then(function(jobs) {
                $jobs.html('');
                jobs.forEach(showJob);
            })
            .catch(function(xhr) {
                showError(`Unable to load jobs (${xhr.status})`);
            });
    }

    function showJob(data) {
        let link = (/^http/.test(data.link)) ? data.link : ('mailto:' + data.link);
        $jobs.prepend(`
            <li>
                <article data-id='${data.id}'>
                    <img src='images/detail.png' alt='Detail' title='Show Detail' class='show-detail'>
                    <p><a href='${link}'>${data.company}</a></p>
                    <button class='delete'>X</button>
                </article>
            </li>
        `);
    }


    function closeModal() {
        $modalElem.hide().find('article').html('');
        $modalCover.hide();
    }

    function clearMessage() {
        $msg.text('').removeClass('success show');
    }
    function showError(msg) {
        $msg.text(msg).addClass('show');
        setTimeout(clearMessage, 4500);
    }
    function showSuccess(msg) {
        $msg.text(msg).addClass('show success');
        setTimeout(clearMessage, 4500);
    }

})();
