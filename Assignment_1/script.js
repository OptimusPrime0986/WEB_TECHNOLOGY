$(document).ready(function () {
    $('#billForm').on('submit', function () {
        const units = $('#units').val();
        if (units === '' || Number(units) < 0) {
            $('#units').addClass('is-invalid');
            return false;
        }
        $('#units').removeClass('is-invalid');
    });
});
