/**
 * Luxury Wedding Landing Page - Scripts
 * Features:
 * - Interactive envelope preloader
 * - Scroll reveals
 * - High-precision countdown
 * - Micro interactions
 * - Interactive Arabic RSVP
 * - Web3Forms integration
 */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initScrollReveals();
    initCountdown('2027-01-22T20:00:00');

    initInteractions();
    initRsvp();
});


/**
 * 1. Interactive Envelope Preloader Controller
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const waxSeal = document.getElementById('wax-seal');
    const hero = document.getElementById('hero-section');

    if (!preloader || !envelopeWrapper || !waxSeal) return;

    waxSeal.addEventListener('click', () => {

        // Open envelope
        envelopeWrapper.classList.add('open');

        // Wait for envelope animation
        setTimeout(() => {

            preloader.classList.add('fade-out');

            // Trigger hero animation
            setTimeout(() => {
                if (hero) {
                    hero.classList.add('loaded');
                }
            }, 300);

            // Remove preloader from page
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1200);

        }, 2000);
    });
}


/**
 * 2. Intersection Observer for Scroll-Based Reveals
 */
function initScrollReveals() {

    const revealElements = document.querySelectorAll(
        '.scroll-reveal, .fade-in-up'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(
        (entries, obs) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add('is-visible');

                    // Trigger only once
                    obs.unobserve(entry.target);
                }

            });

        },
        observerOptions
    );

    revealElements.forEach(el => {
        observer.observe(el);
    });
}


/**
 * 3. High-Precision Countdown
 */
function initCountdown(targetDateStr) {

    const targetDate = new Date(targetDateStr).getTime();

    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    let prevValues = {
        days: '',
        hours: '',
        minutes: '',
        seconds: ''
    };


    function updateTimer() {

        const now = new Date().getTime();

        const difference = targetDate - now;

        let days = 0;
        let hours = 0;
        let minutes = 0;
        let seconds = 0;


        if (difference > 0) {

            days = Math.floor(
                difference / (1000 * 60 * 60 * 24)
            );

            hours = Math.floor(
                (difference % (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
            );

            minutes = Math.floor(
                (difference % (1000 * 60 * 60)) /
                (1000 * 60)
            );

            seconds = Math.floor(
                (difference % (1000 * 60)) /
                1000
            );
        }


        const formatted = {

            days: days.toString().padStart(2, '0'),

            hours: hours.toString().padStart(2, '0'),

            minutes: minutes.toString().padStart(2, '0'),

            seconds: seconds.toString().padStart(2, '0')
        };


        updateDigit(
            daysEl,
            formatted.days,
            prevValues.days
        );

        updateDigit(
            hoursEl,
            formatted.hours,
            prevValues.hours
        );

        updateDigit(
            minutesEl,
            formatted.minutes,
            prevValues.minutes
        );

        updateDigit(
            secondsEl,
            formatted.seconds,
            prevValues.seconds
        );


        prevValues = formatted;
    }


    function updateDigit(element, newValue, oldValue) {

        if (newValue !== oldValue) {

            element.textContent = newValue;

            // Restart rolling animation
            element.classList.remove('digit-roll');

            void element.offsetWidth;

            element.classList.add('digit-roll');
        }
    }


    updateTimer();

    setInterval(updateTimer, 1000);
}


/**
 * 4. Micro-interactions
 */
function initInteractions() {

    const cards = document.querySelectorAll('.detail-card');

    cards.forEach(card => {

        card.addEventListener('mouseenter', () => {

            // Reserved for future luxury interactions

        });

    });
}


/**
 * 5. Arabic RSVP + Web3Forms Integration
 */
function initRsvp() {

    const form = document.getElementById('rsvp-form');

    const fields = document.querySelector('.rsvp-fields');

    const countField =
        document.getElementById('guest-count-field');

    const countInput =
        document.getElementById('guest-count');

    const guestName =
        document.getElementById('guest-name');

    const submitButton =
        form?.querySelector('.rsvp-submit');

    const submitLabel =
        form?.querySelector('.rsvp-submit-label');

    const errorMessage =
        form?.querySelector('.rsvp-error');

    const successPanel =
        document.getElementById('rsvp-success');

    const successTitle =
        successPanel?.querySelector('h3');

    const successText =
        successPanel?.querySelector('p');

    const statusInputs =
        form?.querySelectorAll(
            'input[name="attendance_status"]'
        );


    if (
        !form ||
        !fields ||
        !countField ||
        !countInput ||
        !guestName ||
        !submitButton ||
        !submitLabel ||
        !errorMessage ||
        !successPanel ||
        !successTitle ||
        !successText ||
        !statusInputs
    ) {
        return;
    }


    let selectedStatus = '';


    /**
     * Attendance selection
     */
    statusInputs.forEach(input => {

        input.addEventListener('change', () => {

            selectedStatus = input.value;

            fields.classList.add('is-visible');


            const isAttending =
                selectedStatus === 'attending';


            // Show guest count only when attending
            countField.hidden = !isAttending;


            // Required only when attending
            countInput.required = isAttending;


            // Clear guest count when declining
            if (!isAttending) {

                countInput.value = '';

            }


            // Change button text
            submitLabel.textContent = isAttending
                ? 'تأكيد الحضور ✨'
                : 'إرسال الرد 🤍';


            errorMessage.textContent = '';

        });

    });


    /**
     * Submit RSVP to Web3Forms
     */
    form.addEventListener('submit', async event => {

        event.preventDefault();

        errorMessage.textContent = '';


        /**
         * Validate attendance selection
         */
        if (!selectedStatus) {

            errorMessage.textContent =
                'يرجى اختيار حالة الحضور أولًا';

            return;
        }


        /**
         * Validate required fields
         */
        if (!form.checkValidity()) {

            form.reportValidity();

            return;
        }


        const isAttending =
            selectedStatus === 'attending';


        const originalButtonText = isAttending
            ? 'تأكيد الحضور ✨'
            : 'إرسال الرد 🤍';


        /**
         * Loading state
         */
        submitButton.disabled = true;

        submitLabel.textContent =
            'جاري تسجيل ردكم...';


        try {

            const formData = new FormData(form);


            /**
             * Make email data more readable
             */

            formData.set(
                'attendance_status',
                isAttending
                    ? 'بكل سرور، سأحضر 🎉'
                    : 'للأسف، لن أتمكن من الحضور 🤍'
            );


            if (isAttending) {

                const count =
                    formData.get('guest_count');


                const countLabels = {

                    '1': '1 شخص',

                    '2': '2 أشخاص',

                    '3': '3 أشخاص',

                    '4': '4 أشخاص',

                    '5': '5 أشخاص أو أكثر'

                };


                formData.set(
                    'guest_count',
                    countLabels[count] || count
                );

            } else {

                // Remove guest count for declining guests
                formData.delete('guest_count');

            }


            /**
             * Convert FormData to JSON
             */
            const object =
                Object.fromEntries(formData);


            /**
             * Send data to Web3Forms
             */
            const response = await fetch(
                'https://api.web3forms.com/submit',
                {

                    method: 'POST',

                    headers: {

                        'Content-Type':
                            'application/json',

                        'Accept':
                            'application/json'

                    },

                    body: JSON.stringify(object)

                }
            );


            const result =
                await response.json();


            /**
             * Successful submission
             */
            if (result.success) {

                form.hidden = true;

                successPanel.hidden = false;


                if (isAttending) {

                    successTitle.textContent =
                        'تم تأكيد حضوركم بنجاح ✨';

                    successText.textContent =
                        'يسعدنا جدًا مشاركتكم فرحتنا، ونتطلع لرؤيتكم في هذا اليوم المميز 🤍';

                } else {

                    successTitle.textContent =
                        'شكرًا لإبلاغنا 🤍';

                    successText.textContent =
                        'سنفتقد وجودكم ونتمنى أن نلتقي بكم في مناسبات سعيدة قريبًا';

                }


            } else {

                /**
                 * Web3Forms returned an error
                 */
                errorMessage.textContent =
                    result.message ||
                    'حدثت مشكلة أثناء إرسال الرد. يرجى المحاولة مرة أخرى.';


                submitButton.disabled = false;

                submitLabel.textContent =
                    originalButtonText;

            }


        } catch (error) {

            console.error(
                'RSVP submission error:',
                error
            );


            /**
             * Network error
             */
            errorMessage.textContent =
                'حدثت مشكلة في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى.';


            submitButton.disabled = false;

            submitLabel.textContent =
                originalButtonText;

        }

    });

}