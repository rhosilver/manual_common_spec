describe('SimulScan Functionality Test', function() {

    var logPostTemplate = 'file:///sdcard/templates/Logistics%20Post.xml';
    logPostTemplate = 'file://' + encodeURI('/storage/sdcard1/simulscan/templates/Logistics Post.xml');

    var pprint = function(value) {
        var list = [];
        var each = function(object, f) {
            for (var p in object) {
                if (object.hasOwnProperty(p)) {
                    f(p, object[p]);
                }
            }
        };
        var pprint = function(prefix, value) {
            var indent = '....';
            if (value instanceof Array) {
                list.push('[\n' + prefix + indent);
                for (var i = 0; i < value.length; ++i) {
                    pprint(prefix + indent, value[i]);
                    if (i < value.length - 1) {
                        list.push(',\n' + prefix + indent);
                    }
                }
                list.push('\n' + prefix + ']');
            } else if (value instanceof Object) {
                list.push('{');
                var first = true;
                each(value, function(k, v) {
                    if (first) {
                        first = false;
                    } else {
                        list.push(',');
                    }
                    list.push('\n' + prefix + indent + "'" + k + "': ");
                    pprint(prefix + indent, v);
                });
                list.push('\n' + prefix + '}');
            } else if (typeof value === 'string' || value instanceof String) {
                list.push("'" + value + "'");
            } else {
                list.push(value);
            }
        };

        pprint('', value);
        return list.join('');
    };

    var runsCaptureDocument = function(callbackType, callback) {
        var stopped = false;

        runs(function() {
            displayResult('Output: ', '-');
            Rho.SimulScan.captureDocument(function(dict) {
                if (dict['callbackType'] === callbackType) {
                    callback(dict);
                }
                if (dict['callbackType'] === Rho.SimulScan.STOP) {
                    stopped = true;
                }
            });
        });

        waitsFor(function() {
            return stopped;
        }, "the capture to complete", 1000000);
    };

    var getformCaptureImageId = null;
    var getregionImageId = null;

    beforeEach(function() {
        getformCaptureImageId = null;
        getregionImageId = null;
        Rho.SimulScan.close();
    });

    it('Document capture with barcode, omr, ocr, picture.', function() {
        dispTestCaseRunning('Scan Delivery Attempt Notification');
        dispExpectedResult('No expected result. This is automatic test.');

        _result.waitToRunAutoTest();

        Rho.SimulScan.template = logPostTemplate;
        Rho.SimulScan.uiResultConfirmation = false;
        Rho.SimulScan.audioFeedback = false;

        var regions;

        runsCaptureDocument(Rho.SimulScan.SUCCESS, function(dict) {
            regions = dict['processedForm']['regions'];
        });

        runs(function() {
            _result.passed();

            expect(regions[0]['processingMode']).toEqual(Rho.SimulScan.PM_BARCODE);
            expect(regions[1]['processingMode']).toEqual(Rho.SimulScan.PM_OMR);
            expect(regions[2]['processingMode']).toEqual(Rho.SimulScan.PM_OCR);
            expect(regions[5]['processingMode']).toEqual(Rho.SimulScan.PM_PICTURE);
        });

        _result.waitForResponse();
    });

    it('autoImageCapture turned off.', function() {
        dispTestCaseRunning('Frame Delivery Attempt Notification\nTap screen on corresponding prompt.');
        dispExpectedResult('callbackType should be success.');

        _result.waitToRunTest();

        Rho.SimulScan.template = logPostTemplate;
        Rho.SimulScan.audioFeedback = false;
        Rho.SimulScan.uiResultConfirmation = false;

        Rho.SimulScan.autoImageCapture = false;

        runsCaptureDocument(Rho.SimulScan.SUCCESS, function(dict) {
            displayResult('Output: ', 'callbackType is ' + dict['callbackType']);
        });

        _result.waitForResponse();
    });

    it('autoImageCapture in effect.', function() {
        dispTestCaseRunning('Frame Delivery Attempt Notification\nHold device steady.');
        dispExpectedResult('callbackType should be success.\nDevice should scan form automatically.');

        _result.waitToRunTest();

        Rho.SimulScan.template = logPostTemplate;
        Rho.SimulScan.audioFeedback = false;
        Rho.SimulScan.uiResultConfirmation = false;

        Rho.SimulScan.autoImageCapture = true;

        runsCaptureDocument(Rho.SimulScan.SUCCESS, function(dict) {
            displayResult('Output: ', 'callbackType is ' + dict['callbackType']);
        });

        _result.waitForResponse();
    });

    it('Only audio feedback is on.', function() {
        dispTestCaseRunning('Scan Delivery Attempt Notification');
        dispExpectedResult('callbackType should be success.\nThere must be only audio feedback at end of scan.');

        _result.waitToRunTest();

        Rho.SimulScan.template = logPostTemplate;
        Rho.SimulScan.uiResultConfirmation = false;

        Rho.SimulScan.audioFeedback = true;
        Rho.SimulScan.hapticFeedback = false;
        Rho.SimulScan.ledFeedback = false;

        runsCaptureDocument(Rho.SimulScan.SUCCESS, function(dict) {
            displayResult('Output: ', 'callbackType is ' + dict['callbackType']);
        });

        _result.waitForResponse();
    });

    it('Only haptic feedback is on.', function() {
        dispTestCaseRunning('Scan Delivery Attempt Notification');
        dispExpectedResult('callbackType should be success.\nThere must be only haptic feedback at end of scan.');

        _result.waitToRunTest();

        Rho.SimulScan.template = logPostTemplate;
        Rho.SimulScan.uiResultConfirmation = false;

        Rho.SimulScan.audioFeedback = false;
        Rho.SimulScan.hapticFeedback = true;
        Rho.SimulScan.ledFeedback = false;

        runsCaptureDocument(Rho.SimulScan.SUCCESS, function(dict) {
            displayResult('Output: ', 'callbackType is ' + dict['callbackType']);
        });

        _result.waitForResponse();
    });

    it('Only led feedback is on.', function() {
        dispTestCaseRunning('Scan Delivery Attempt Notification');
        dispExpectedResult('callbackType should be success.\nThere must be only led feedback at end of scan.');

        _result.waitToRunTest();

        Rho.SimulScan.template = logPostTemplate;
        Rho.SimulScan.uiResultConfirmation = false;

        Rho.SimulScan.audioFeedback = false;
        Rho.SimulScan.hapticFeedback = false;
        Rho.SimulScan.ledFeedback = true;

        runsCaptureDocument(Rho.SimulScan.SUCCESS, function(dict) {
            displayResult('Output: ', 'callbackType is ' + dict['callbackType']);
        });

        _result.waitForResponse();
    });

    it('flash mode is on', function() {
        dispTestCaseRunning('Scan Delivery Attempt Notification');
        dispExpectedResult('callbackType should be success.\nFlash must be on during scan.');

        _result.waitToRunTest();

        Rho.SimulScan.template = logPostTemplate;
        Rho.SimulScan.uiResultConfirmation = false;
        Rho.SimulScan.audioFeedback = false;

        Rho.SimulScan.flashMode = Rho.SimulScan.FLASH_ON;

        runsCaptureDocument(Rho.SimulScan.SUCCESS, function(dict) {
            displayResult('Output: ', 'callbackType is ' + dict['callbackType']);
        });

        _result.waitForResponse();
    });

    it('flash mode is off', function() {
        dispTestCaseRunning('Scan Delivery Attempt Notification');
        dispExpectedResult('callbackType should be success.\nFlash must be off during scan.');

        _result.waitToRunTest();

        Rho.SimulScan.template = logPostTemplate;
        Rho.SimulScan.uiResultConfirmation = false;
        Rho.SimulScan.audioFeedback = false;

        Rho.SimulScan.flashMode = Rho.SimulScan.FLASH_OFF;

        runsCaptureDocument(Rho.SimulScan.SUCCESS, function(dict) {
            displayResult('Output: ', 'callbackType is ' + dict['callbackType']);
        });

        _result.waitForResponse();
    });

    it('flash mode is disabled', function() {
        dispTestCaseRunning('Scan Delivery Attempt Notification');
        dispExpectedResult('callbackType should be success.\nFlash must be disbaled during scan.');

        _result.waitToRunTest();

        Rho.SimulScan.template = logPostTemplate;
        Rho.SimulScan.uiResultConfirmation = false;
        Rho.SimulScan.audioFeedback = false;

        Rho.SimulScan.flashMode = Rho.SimulScan.FLASH_DISABLED;

        runsCaptureDocument(Rho.SimulScan.SUCCESS, function(dict) {
            displayResult('Output: ', 'callbackType is ' + dict['callbackType']);
        });

        _result.waitForResponse();
    });

    it('processingTimeout 1 second', function() {
        dispTestCaseRunning('1. Frame Delivery Attempt Notification in camera.\n2. Tap to scan.\n3. Immediately start swinging of device.');
        dispExpectedResult('failureReason should be processingTimeout. Scanning should take about one second.');

        _result.waitToRunTest();

        Rho.SimulScan.template = logPostTemplate;
        Rho.SimulScan.uiResultConfirmation = false;
        Rho.SimulScan.audioFeedback = false;
        Rho.SimulScan.autoImageCapture = false;

        Rho.SimulScan.processingTimeout = 1000;

        runsCaptureDocument(Rho.SimulScan.FAILURE, function(dict) {
            displayResult('Output: ', 'failureReason is ' + dict['failureReason']);
        });

        _result.waitForResponse();
    });

    it('processingTimeout 5 second', function() {
        dispTestCaseRunning('1. Frame Delivery Attempt Notification in camera.\n2. Tap to scan.\n3. Immediately start swinging of device.');
        dispExpectedResult('failureReason should be processingTimeout. Scanning should take about five second.');

        _result.waitToRunTest();

        Rho.SimulScan.template = logPostTemplate;
        Rho.SimulScan.uiResultConfirmation = false;
        Rho.SimulScan.audioFeedback = false;
        Rho.SimulScan.autoImageCapture = false;

        Rho.SimulScan.processingTimeout = 5000;

        runsCaptureDocument(Rho.SimulScan.FAILURE, function(dict) {
            displayResult('Output: ', 'failureReason is ' + dict['failureReason']);
        });

        _result.waitForResponse();
    });

    it('identificationTimeout 5 second', function() {
        dispTestCaseRunning('Do not frame form. Wait for 20s. Press back button.');
        dispExpectedResult('identificationTimeout should be about 5.');

        _result.waitToRunTest();

        Rho.SimulScan.template = logPostTemplate;
        Rho.SimulScan.uiResultConfirmation = false;
        Rho.SimulScan.audioFeedback = false;

        Rho.SimulScan.identificationTimeout = 5000;

        var start;
        runs(function() {
            start = new Date().getTime();
        });

        runsCaptureDocument(Rho.SimulScan.FAILURE, function(dict) {
            var finish = new Date().getTime();
            displayResult('Output: ', 'identificationTimeout is ' + (finish - start) / 1000);
        });

        _result.waitForResponse();
    });

    it('identificationTimeout 10 second', function() {
        dispTestCaseRunning('Do not frame form. Wait for 20s. Press back button.');
        dispExpectedResult('identificationTimeout should be about 10.');

        _result.waitToRunTest();

        Rho.SimulScan.template = logPostTemplate;
        Rho.SimulScan.uiResultConfirmation = false;
        Rho.SimulScan.audioFeedback = false;

        Rho.SimulScan.identificationTimeout = 10000;

        var start;
        runs(function() {
            start = new Date().getTime();
        });

        runsCaptureDocument(Rho.SimulScan.FAILURE, function(dict) {
            var finish = new Date().getTime();
            displayResult('Output: ', 'identificationTimeout is ' + (finish - start) / 1000);
        });

        _result.waitForResponse();
    });

    it('Debug mode.', function() {
        dispTestCaseRunning('Scan Delivery Attempt Notification');
        dispExpectedResult('callbackType should be success.\nThere is new subdirectory in /sdcard/RhoSimulScanLog directory.');

        _result.waitToRunTest();

        Rho.SimulScan.template = logPostTemplate;
        Rho.SimulScan.uiResultConfirmation = false;
        Rho.SimulScan.audioFeedback = false;

        Rho.SimulScan.debug = true;
        Rho.SimulScan.logDirectory = '/sdcard/RhoSimulScanLog';

        runsCaptureDocument(Rho.SimulScan.SUCCESS, function(dict) {
            displayResult('Output: ', 'callbackType is ' + dict['callbackType']);
        });

        _result.waitForResponse();
    });

    it('uiResultConfirmation in effect.', function() {
        dispTestCaseRunning('Scan Delivery Attempt Notification\nPress "Accept" on UI confirmation screen.');
        dispExpectedResult('callbackType should be success.\nThere must be UI confirmation screen after scanning.');

        _result.waitToRunTest();

        Rho.SimulScan.template = logPostTemplate;
        Rho.SimulScan.audioFeedback = false;

        Rho.SimulScan.uiResultConfirmation = true;

        runsCaptureDocument(Rho.SimulScan.SUCCESS, function(dict) {
            displayResult('Output: ', 'callbackType is ' + dict['callbackType']);
        });

        _result.waitForResponse();
    });

    it('getDataUri retrieves images.', function() {
        var add_image = function(image) {
            var list = document.getElementById('myList');

            var item = document.createElement('li');
            list.appendChild(item);

            var img = document.createElement('img');
            img.setAttribute('src', Rho.SimulScan.getDataUri(image['id']));
            item.appendChild(img);
        };

        dispTestCaseRunning('Scan Delivery Attempt Notification.');
        dispExpectedResult('You should see images for regions and for whole form.');

        _result.waitToRunTest();

        Rho.SimulScan.template = logPostTemplate;
        Rho.SimulScan.uiResultConfirmation = false;
        Rho.SimulScan.audioFeedback = false;

        runsCaptureDocument(Rho.SimulScan.SUCCESS, function(dict) {
            $('#myList').empty();
            var list = document.getElementById('myList');

            var regions = dict['processedForm']['regions'];
            for (var i = 0; i < regions.length; ++i) {
                if (regions[i].hasOwnProperty('image')) {
                    add_image(regions[i]['image']);
                }
            }
            add_image(dict['processedForm']['formCapture']['image']);
        });

        _result.waitForResponse();
    });

    it('Objective:\nDocument capture set audioFeedback  property with default value', function() {
        dispTestCaseRunning('1. Set template property to path of template.xml has region of Optical Character Recognition \n/sdcard/Application/template.xml\n2. Call captureDocument method Capture a document by taking a photo\n\n\n\n\n');
        dispExpectedResult('Should get the audio feedback at the time captured document is getting processed after proceessed successfully callback fired once for each field defined in the template');
        //Common Method implemented to wait for tester to run the test.Code available in specHelper.js
        _result.waitToRunTest();
        runs(function() {
                Rho.SimulScan.inputSource = Rho.SimulScan.SOURCE_CAMERA;
                Rho.SimulScan.template = Rho.RhoFile.join(Rho.Application.AppBundleFolder, 'picture.xml');
                Rho.SimulScan.captureDocument(captureCallback);
        });
        //Add more waitsfor or run blocks if required.
        //Common Method implemented to wait for tester to make it pass or fail.Code available in specHelper.js
        _result.waitForResponse();
    });


    it('Objective:\nDocument capture with audioFeedback  property set to invalid', function() {
        dispTestCaseRunning('1. Set template property to path of template.xml has region of  picture\n/sdcard/Application/template.xml\n2.Set audioFeedback to audio\n3. Call captureDocument method Capture a document by taking a photo\n');
        dispExpectedResult('Should not get the audio feedback at the time captured document is getting processed but after proceessed successfully callback fired once for each field defined in the template');
        //Common Method implemented to wait for tester to run the test.Code available in specHelper.js
        _result.waitToRunTest();
        runs(function() {
                Rho.SimulScan.inputSource = Rho.SimulScan.SOURCE_CAMERA;
                Rho.SimulScan.audioFeedback = 'invalid';
                Rho.SimulScan.template = Rho.RhoFile.join(Rho.Application.AppBundleFolder, 'picture.xml');
                Rho.SimulScan.captureDocument(captureCallback);
        });
        //Add more waitsfor or run blocks if required.
        //Common Method implemented to wait for tester to make it pass or fail.Code available in specHelper.js
        _result.waitForResponse();
    });

    it('Objective:\nDocument capture with hapticFeedback  property set to invalid value', function() {
        dispTestCaseRunning('1. Set template property to path of template.xml has region of  picture\n/sdcard/Application/template.xml\n2.Set hapticFeedback to feedback\n3. Call captureDocument method Capture a document by taking a photo\n');
        dispExpectedResult('Should not get the haptic feedback at the time captured document is getting processed but after proceessed successfully callback fired once for each field defined in the template');
        //Common Method implemented to wait for tester to run the test.Code available in specHelper.js
        _result.waitToRunTest();
        runs(function() {
                Rho.SimulScan.inputSource = Rho.SimulScan.SOURCE_CAMERA;
                Rho.SimulScan.hapticFeedback = 'invalid';
                Rho.SimulScan.template = Rho.RhoFile.join(Rho.Application.AppBundleFolder, 'picture.xml');
                Rho.SimulScan.captureDocument(captureCallback);
        });
        //Add more waitsfor or run blocks if required.
        //Common Method implemented to wait for tester to make it pass or fail.Code available in specHelper.js
        _result.waitForResponse();
    });

    it('Objective:\nDocument capture with ledFeedback  property set to invalid value', function() {
        dispTestCaseRunning('1. Set template property to path of template.xml has region of  picture\n/sdcard/Application/template.xml\n2.Set ledFeedback to ledFeedback\n3. Call captureDocument method Capture a document by taking a photo\n');
        dispExpectedResult('Should not get the led feedback at the time captured document is getting processed but after proceessed successfully callback fired once for each field defined in the template');
        //Common Method implemented to wait for tester to run the test.Code available in specHelper.js
        _result.waitToRunTest();
        runs(function() {
                Rho.SimulScan.inputSource = Rho.SimulScan.SOURCE_CAMERA;
                Rho.SimulScan.ledFeedback = 'invalid';
                Rho.SimulScan.template = Rho.RhoFile.join(Rho.Application.AppBundleFolder, 'picture.xml');
                Rho.SimulScan.captureDocument(captureCallback);
        });
        //Add more waitsfor or run blocks if required.
        //Common Method implemented to wait for tester to make it pass or fail.Code available in specHelper.js
        _result.waitForResponse();
    });


    it('Objective:\nDocument capture with identificationTimeout  property set to -10000 (-10 second)\n\n', function() {
        dispTestCaseRunning('1. Set template property to path of template.xml has region of  picture\n/sdcard/Application/template.xml\n2.Set inputSource to camera\n3.Set identificationTimeout to -10000\n4. Call captureDocument method Capture a document by taking a photo using camera\n');
        dispExpectedResult('Callack should return identification timout(FAILURE_IDENTIFICATION_TIMEOUT)\nwhen not able to capture the photo within -10 seconds');
        //Common Method implemented to wait for tester to run the test.Code available in specHelper.js
        _result.waitToRunTest();
        runs(function() {
                Rho.SimulScan.inputSource = Rho.SimulScan.SOURCE_CAMERA;
                Rho.SimulScan.identificationTimeout = -10000;
                Rho.SimulScan.template = Rho.RhoFile.join(Rho.Application.AppBundleFolder, 'picture.xml');
                Rho.SimulScan.captureDocument(captureCallback);
        });
        //Add more waitsfor or run blocks if required.
        //Common Method implemented to wait for tester to make it pass or fail.Code available in specHelper.js
        _result.waitForResponse();
    });

    it('Objective:\nDocument capture with inputSource  property set to invalid value\n\n', function() {
        dispTestCaseRunning('1. Set template property to path of template.xml has region of  picture\n/sdcard/Application/template.xml\n2.Set fileInteractiveMode to true\n3.Set inputSource to Invalid\n4. inputSourceFilename to /sdcard/Appliaction/image.jpg\n5. Call captureDocument method Capture a document by given image as a file\n');
        dispExpectedResult('should not capture the impage because  inputSource set to invalid source');
        //Common Method implemented to wait for tester to run the test.Code available in specHelper.js
        _result.waitToRunTest();
        runs(function() {
                Rho.SimulScan.template = Rho.RhoFile.join(Rho.Application.AppBundleFolder, 'picture.xml');
                Rho.SimulScan.inputSource = 'invalid';
                Rho.SimulScan.fileInteractiveMode = 'true';
                Rho.SimulScan.inputSourceFilename = Rho.RhoFile.join(Rho.Application.AppBundleFolder, 'image.jpg');
                Rho.SimulScan.captureDocument(captureCallback);
        });
        //Add more waitsfor or run blocks if required.
        //Common Method implemented to wait for tester to make it pass or fail.Code available in specHelper.js
        _result.waitForResponse();
    });

    it('Objective:\nDocument capture set debug property  to invalid value and logDirectory  property set to /sdcard/Application/SimulScanLog\n\n', function() {
        dispTestCaseRunning('1. Set template property to path of template.xml has region of  picture\n/sdcard/Application/template.xml\n2.Set debug to invalid\n3.Set logDirectory to /sdcard/Application/SimulScanLog\n4.Set inputSource to camera\n5. Call captureDocument method Capture a document by taking a photo using camera\n');
        dispExpectedResult('captured document should get processed successfully and callback fired once for each field defined in the template \n\nbut It should not create the logdirectory at specified path because debug property default value is set to invalid');
        //Common Method implemented to wait for tester to run the test.Code available in specHelper.js
        _result.waitToRunTest();
        runs(function() {
                Rho.SimulScan.template = Rho.RhoFile.join(Rho.Application.AppBundleFolder, 'picture.xml');
                Rho.SimulScan.debug = 'invalid';
                Rho.SimulScan.logDirectory = '/sdcard/Application/SimulScanLog';
                Rho.SimulScan.inputSource = Rho.SimulScan.SOURCE_CAMERA;
                Rho.SimulScan.captureDocument(captureCallback);
        });
        //Add more waitsfor or run blocks if required.
        //Common Method implemented to wait for tester to make it pass or fail.Code available in specHelper.js
        _result.waitForResponse();
    });

    it('Objective:\nDocument capture set debug property  to true  and logDirectory  property set to invalid path\n', function() {
        dispTestCaseRunning('1. Set template property to path of template.xml has region of  picture\n/sdcard/Application/template.xml\n2.Set debug to true\n3.Set logDirectory to /Application/sdcard/SimulScanLog\n4.Set inputSource to camera\n5. Call captureDocument method Capture a document by taking a photo using camera\n');
        dispExpectedResult('captured document should get processed successfully and callback fired once for each field defined in the template \n\nand It should not create the logdirectory because specified path is invalid');
        //Common Method implemented to wait for tester to run the test.Code available in specHelper.js
        _result.waitToRunTest();
        runs(function() {
                Rho.SimulScan.template = Rho.RhoFile.join(Rho.Application.AppBundleFolder, 'picture.xml');
                Rho.SimulScan.debug = true;
                Rho.SimulScan.logDirectory = '/Application/sdcard/SimulScanLog';
                Rho.SimulScan.inputSource = Rho.SimulScan.SOURCE_CAMERA;
                Rho.SimulScan.captureDocument(captureCallback);
        });
        //Add more waitsfor or run blocks if required.
        //Common Method implemented to wait for tester to make it pass or fail.Code available in specHelper.js
        _result.waitForResponse();
    });

    it('Objective:\nDocument capture set processingTimeout  property set to invalid value', function() {
        dispTestCaseRunning('1. Set template property to path of template.xml has region of  picture\n/sdcard/Application/template.xml\n2.Set processingTimeout to invalid\n3. Set inputSource to camera\n4. Call captureDocument method Capture a document by taking a photo using camera');
        dispExpectedResult('processingTimeout error should returned in callback when captured document is not able to processed successfully in 10 seconds');
        //Common Method implemented to wait for tester to run the test.Code available in specHelper.js
        _result.waitToRunTest();
        runs(function() {
                Rho.SimulScan.template = Rho.RhoFile.join(Rho.Application.AppBundleFolder, 'picture.xml');
                Rho.SimulScan.processingTimeout = -10000;
                Rho.SimulScan.inputSource = Rho.SimulScan.SOURCE_CAMERA;
                Rho.SimulScan.captureDocument(captureCallback);
        });
        //Add more waitsfor or run blocks if required.
        //Common Method implemented to wait for tester to make it pass or fail.Code available in specHelper.js
        _result.waitForResponse();
    });

    it('Objective:\nDocument capture set uiResultConfirmation property set to invalid\n', function() {
        dispTestCaseRunning('1. Set template property to path of template.xml has region of  picture\n/sdcard/Application/template.xml\n2. Set uiResultConfirmation to invalid\n3. Set inputSource to camera\n4. Call captureDocument method Capture a document by taking a photo using camera\n');
        dispExpectedResult('It should shows a UI confirmation with results in SimulScanView before sending results back to application \n\nafter captured document successfully processed and callback fired once for each field defined in the template ');
        //Common Method implemented to wait for tester to run the test.Code available in specHelper.js
        _result.waitToRunTest();
        runs(function() {
                Rho.SimulScan.template = Rho.RhoFile.join(Rho.Application.AppBundleFolder, 'picture.xml');
                Rho.SimulScan.uiResultConfirmation = 'invalid';
                Rho.SimulScan.inputSource = Rho.SimulScan.SOURCE_CAMERA;
                Rho.SimulScan.captureDocument(captureCallback);
        });
        //Add more waitsfor or run blocks if required.
        //Common Method implemented to wait for tester to make it pass or fail.Code available in specHelper.js
        _result.waitForResponse();
    });


    it('Objective:\nDocument capture and show image on HTML page using invalid Id of image in imageId param calling getDataUri method\n', function() {
        dispTestCaseRunning('1. Set template property to path of template.xml has region of  picture\n/sdcard/Application/template.xml\n2. Set inputSource to camera\n3. Call captureDocument method Capture a document by taking a photo using camera\n5. Call getDataUri method with invalid imageid (id of image will be returned in callback with processedData)\n\n');
        dispExpectedResult('captured document should get processed successfully and callback fired once for each field defined in the template and \n\nit should not show the image on HTML page insert data URI in src attribute of img tag');
        //Common Method implemented to wait for tester to run the test.Code available in specHelper.js
        _result.waitToRunTest();
        runs(function() {
                Rho.SimulScan.template = Rho.RhoFile.join(Rho.Application.AppBundleFolder, 'picture.xml');
                Rho.SimulScan.inputSource = Rho.SimulScan.SOURCE_CAMERA;
                Rho.SimulScan.captureDocument(captureCallback);
                waitsFor(function () {
                        return getregionImageId != null;
                }, '90sec Wait before move to next test', 90000);
                Rho.SimulScan.getDataUri(100);
        });
        //Add more waitsfor or run blocks if required.
        //Common Method implemented to wait for tester to make it pass or fail.Code available in specHelper.js
        _result.waitForResponse();
    });


    var captureCallback =  function (args){

        var result = '';
            //result = JSON.stringify(args);
            result += '<br/>Callbacktype:- ' + JSON.stringify(args.callbackType);
            result += '<br/>Failurereason:- ' + JSON.stringify(args.failureReason);
            result += '<br/>TemplatName:- ' + JSON.stringify(args.processedForm.template.name);
            result += '<br/>TemplatNumber:- ' + JSON.stringify(args.processedForm.template.number);
            result += '<br/>CapturedFormName:- ' + JSON.stringify(args.processedForm.formCapture.name);
            result += '<br/>CapturedFormwidth:- ' + JSON.stringify(args.processedForm.formCapture.image.width);
            result += '<br/>CapturedFormheight:- ' + JSON.stringify(args.processedForm.formCapture.image.height);
            result += '<br/>CapturedFormid:- ' + JSON.stringify(args.processedForm.formCapture.image.id);
            result += '<br/>RegionGroup:- ' + JSON.stringify(args.processedForm.regions[0].group);
            result += '<br/>RegionName:- ' + JSON.stringify(args.processedForm.regions[0].name);
            result += '<br/>RegionNumber:- ' + JSON.stringify(args.processedForm.regions[0].number);
            result += '<br/>RegionProccessingMode:- ' + JSON.stringify(args.processedForm.regions[0].processingMode);
            result += '<br/>RegionProccessingMode:- ' + JSON.stringify(args.processedForm.regions[0].processedData);
            result += '<br/>ProccessedImageWidth:- ' + JSON.stringify(args.processedForm.regions[0].image.width);
            result += '<br/>ProccessedImageWidth:- ' + JSON.stringify(args.processedForm.regions[0].image.height);
            result += '<br/>ProccessedImageHieght:- ' + JSON.stringify(args.processedForm.regions[0].image.id);
            result += '<br/>RelativeocrConfidence:- ' + JSON.stringify(args.processedForm.regions[0].relativeOcrConfidence);
            result += '<br/>AbsoluteocrConfidence:- ' + JSON.stringify(args.processedForm.regions[0].absoluteOcrConfidence);

            getformCaptureImageId =  JSON.stringify(args.processedForm.formCapture.image.id);
            getregionImageId =  JSON.stringify(args.processedForm.regions[0].image.id);

        displayResult("Output: ",result);
    };
});
