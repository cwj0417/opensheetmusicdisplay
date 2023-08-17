import { OpenSheetMusicDisplay } from '../src/OpenSheetMusicDisplay/OpenSheetMusicDisplay';
import { TransposeCalculator } from '../src/Plugins/Transpose/TransposeCalculator';

/*jslint browser:true */
(function () {
    "use strict";
    let isShowTime = false
    let isTiming = false
    let time = 0
    var openSheetMusicDisplay;
    var sampleFolder = "self/",
        samples = {
            'Sonata No. 11, 3rd Movement K. 331 "Alla Turca"': 'Piano_Sonata_No._11_K._331_3rd_Movement_Rondo_alla_Turca.mxl',
            'Für Elise': 'Fr_Elise.mxl',
            'Waltz in A Minor(Chopin)': 'Waltz_in_A_MinorChopin.mxl',
            'Canon in D': 'Canon_in_D.mxl',
            'Canon in D (easy)': 'Canon_in_D_easy.mxl',
            'Minuet BWV Anhang 114 in G Major': 'Minuet_in_G_Major_Bach.mxl',
            'The Blue Danube(easy)': 'The_Blue_Danube.mxl',
            'The Blue Danube(intermediate)': 'Danubio_azulBlue_Danube.mxl',
            'Sonate No. 14, “Moonlight” 1st Movement': 'Sonate_No._14_Moonlight_1st_Movement.mxl',
            'Sonate No. 14 (2nd mvt) Moonlight': 'Sonata_No._14.mxl',
            'Sonate No. 14, “Moonlight” 3rd Movement': 'Sonate_No._14_Moonlight_3rd_Movement.mxl',
            'Sonata No. 16, 1st Movement K. 545': 'Sonata_No._16_1st_Movement_K._545.mxl',
            'Sonate No. 8,“Pathétique” 1st Movement': 'Sonate_No._8Pathetique_1st_Movement.mxl',
            'Sonate No. 8, “Pathétique” 2nd Movement': 'Sonate_No._8_Pathetique_2nd_Movement.mxl',
            'Sonate No. 8, “Pathétique” 3rd Movement': 'Sonate_No._8_Pathetique_3rd_Movement.mxl',
            'Chopin - Nocturne Op 9 No 2(E Flat Major)': 'Chopin_-_Nocturne_Op_9_No_2_E_Flat_Major.mxl',
            'Chopin - Nocturne Op. 9 No. 1': 'Chopin_-_Nocturne_Op._9_No._1.mxl',
        },

        zoom = 1.0,
        // HTML Elements in the page
        divControls,
        zoomControls,
        header,
        err,
        error_tr,
        canvas,
        selectSample,
        selectBounding,
        skylineDebug,
        bottomlineDebug,
        zoomIns,
        zoomOuts,
        zoomDivs,
        custom,
        previousCursorBtn,
        nextCursorBtn,
        resetCursorBtn,
        followCursorCheckbox,
        showCursorBtn,
        hideCursorBtn,
        backendSelect,
        backendSelectDiv,
        debugReRenderBtn,
        debugClearBtn,
        selectPageSizes,
        printPdfBtns,
        transpose,
        transposeBtn;

    // manage option setting and resetting for specific samples, e.g. in the autobeam sample autobeam is set to true, otherwise reset to previous state
    // TODO design a more elegant option state saving & restoring system, though that requires saving the options state in OSMD
    var minMeasureToDrawStashed = 1;
    var maxMeasureToDrawStashed = Number.MAX_SAFE_INTEGER;
    var measureToDrawRangeNeedsReset = false;
    var drawingParametersStashed = "default";
    var drawingParametersNeedsReset = false;
    var autobeamOptionNeedsReset = false;
    var autobeamOptionStashedValue = false;
    var autoCustomColoringOptionNeedsReset = false;
    var autoCustomColoringOptionStashedValue = false;
    var drawPartNamesOptionStashedValue = true;
    var drawPartAbbreviationsStashedValue = true;
    var drawPartNamesOptionNeedsReset = false;
    var pageBreaksOptionStashedValue = false;
    var pageBreaksOptionNeedsReset = false;
    var systemBreaksOptionStashedValue = false; // reset handled by pageBreaksOptionNeedsReset

    var showControls = true;
    var showExportPdfControl = false;
    var showPageFormatControl = false;
    var showZoomControl = true;
    var showHeader = true;
    var showDebugControls = false;

    document.title = "cwj's piano score";

    // Initialization code
    function init() {
        var name, option;

        // Handle window parameter
        var paramEmbedded = findGetParameter('embedded');
        var paramShowControls = findGetParameter('showControls');
        var paramShowPageFormatControl = findGetParameter('showPageFormatControl');
        var paramShowExportPdfControl = findGetParameter('showExportPdfControl');
        var paramShowZoomControl = findGetParameter('showZoomControl');
        var paramShowHeader = findGetParameter('showHeader');
        var paramZoom = findGetParameter('zoom');
        var paramOverflow = findGetParameter('overflow');
        var paramOpenUrl = findGetParameter('openUrl');
        var paramDebugControls = findGetParameter('debugControls');

        var paramCompactMode = findGetParameter('compactMode');
        var paramMeasureRangeStart = findGetParameter('measureRangeStart');
        var paramMeasureRangeEnd = findGetParameter('measureRangeEnd');
        var paramPageFormat = findGetParameter('pageFormat');
        var paramPageBackgroundColor = findGetParameter('pageBackgroundColor');
        var paramBackendType = findGetParameter('backendType');
        var paramPageWidth = findGetParameter('pageWidth');
        var paramPageHeight = findGetParameter('pageHeight');

        var paramHorizontalScrolling = findGetParameter('horizontalScrolling');
        var paramSingleHorizontalStaffline = findGetParameter('singleHorizontalStaffline');

        showHeader = (paramShowHeader !== '0');
        showControls = false;
        if (paramEmbedded) {
            showControls = paramShowControls !== '0';
            showZoomControl = paramShowZoomControl !== '0';
            showPageFormatControl = paramShowPageFormatControl !== '0';
            showExportPdfControl = paramShowExportPdfControl !== '0';
        }

        if (paramZoom) {
            if (paramZoom > 0.1 && paramZoom < 5.0) {
                zoom = paramZoom;
            }
        }
        if (paramOverflow && typeof paramOverflow === 'string') {
            if (paramOverflow === 'hidden' || paramOverflow === 'auto' || paramOverflow === 'scroll' || paramOverflow === 'visible') {
                document.body.style.overflow = paramOverflow;
            }
        }

        var compactMode = paramCompactMode && paramCompactMode !== '0';
        var measureRangeStart = paramMeasureRangeStart ? Number.parseInt(paramMeasureRangeStart) : 0;
        var measureRangeEnd = paramMeasureRangeEnd ? Number.parseInt(paramMeasureRangeEnd) : Number.MAX_SAFE_INTEGER;
        if (measureRangeStart && measureRangeEnd && measureRangeEnd < measureRangeStart) {
            console.log("[OSMD] warning: measure range end parameter should not be smaller than measure range start. We've set start measure = end measure now.")
            measureRangeStart = measureRangeEnd;
        }
        let pageFormat = paramPageFormat ? paramPageFormat : "Endless";
        if (paramPageHeight && paramPageWidth) {
            pageFormat = `${paramPageWidth}x${paramPageHeight}`
        }
        var pageBackgroundColor = paramPageBackgroundColor ? "#" + paramPageBackgroundColor : undefined; // vexflow format, see OSMDOptions. can't use # in parameters.
        //console.log("demo: osmd pagebgcolor: " + pageBackgroundColor);
        var backendType = (paramBackendType && paramBackendType.toLowerCase) ? paramBackendType : "svg";

        var horizontalScrolling = paramHorizontalScrolling === '1';
        var singleHorizontalStaffline = paramSingleHorizontalStaffline === '1';

        divControls = document.getElementById('divControls');
        zoomControls = document.getElementById('zoomControls');
        header = document.getElementById('header');
        err = document.getElementById("error-td");
        error_tr = document.getElementById("error-tr");
        zoomDivs = [];
        zoomDivs.push(document.getElementById("zoom-str"));
        zoomDivs.push(document.getElementById("zoom-str-optional"));
        custom = document.createElement("option");
        selectSample = document.getElementById("selectSample");
        selectBounding = document.getElementById("selectBounding");
        skylineDebug = document.getElementById("skylineDebug");
        bottomlineDebug = document.getElementById("bottomlineDebug");
        zoomIns = [];
        zoomIns.push(document.getElementById("zoom-in-btn"));
        zoomIns.push(document.getElementById("zoom-in-btn-optional"));
        zoomOuts = [];
        zoomOuts.push(document.getElementById("zoom-out-btn"));
        zoomOuts.push(document.getElementById("zoom-out-btn-optional"));
        canvas = document.createElement("div");
        if (horizontalScrolling) {
            canvas.style.overflowX = 'auto'; // enable horizontal scrolling
        }
        //canvas.id = 'osmdCanvasDiv';
        //canvas.style.overflowX = 'auto'; // enable horizontal scrolling
        previousCursorBtn = document.getElementById("previous-cursor-btn");
        nextCursorBtn = document.getElementById("next-cursor-btn");
        resetCursorBtn = document.getElementById("reset-cursor-btn");
        followCursorCheckbox = document.getElementById("follow-cursor-checkbox");
        showCursorBtn = document.getElementById("show-cursor-btn");
        hideCursorBtn = document.getElementById("hide-cursor-btn");
        backendSelect = document.getElementById("backend-select");
        backendSelectDiv = document.getElementById("backend-select-div");
        debugReRenderBtn = document.getElementById("debug-re-render-btn");
        debugClearBtn = document.getElementById("debug-clear-btn");
        selectPageSizes = [];
        selectPageSizes.push(document.getElementById("selectPageSize"));
        selectPageSizes.push(document.getElementById("selectPageSize-optional"));
        printPdfBtns = [];
        printPdfBtns.push(document.getElementById("print-pdf-btn"));
        printPdfBtns.push(document.getElementById("print-pdf-btn-optional"));
        transpose = document.getElementById('transpose');
        transposeBtn = document.getElementById('transpose-btn');

        //var defaultDisplayVisibleValue = "block"; // TODO in some browsers flow could be the better/default value
        var defaultVisibilityValue = "visible";
        showDebugControls = paramDebugControls !== '0';
        if (showDebugControls) {
            var elementsToEnable = [
                selectSample, selectBounding, selectPageSizes[0], backendSelect, backendSelectDiv, divControls
            ];
            for (var i = 0; i < elementsToEnable.length; i++) {
                if (elementsToEnable[i]) { // make sure this element is not null/exists in the index.html, e.g. github.io demo has different index.html
                    if (elementsToEnable[i].style) {
                        elementsToEnable[i].style.visibility = defaultVisibilityValue;
                        elementsToEnable[i].style.opacity = 1.0;
                    }
                }
            }
        } else {
            if (divControls) {
                divControls.style.display = "none";
            }
        }

        if (!showHeader) {
            if (header) {
                header.style.display = 'none';
            }
        } else {
            if (header) {
                header.style.opacity = 1.0;
            }
        }
        // Hide error
        error();

        // Create select
        for (name in samples) {
            if (samples.hasOwnProperty(name)) {
                option = document.createElement("option");
                option.value = samples[name];
                option.textContent = name;
                if (localStorage.getItem('scorename') === samples[name]) {
                    option.selected = true
                }
            }
            if (selectSample) {
                selectSample.appendChild(option);
            }
        }
        if (selectSample) {
            selectSample.onchange = selectSampleOnChange;
        }
        // Pre-select default music piece

        custom.appendChild(document.createTextNode("Custom"));

        // Create zoom controls
        for (const zoomIn of zoomIns) {
            if (zoomIn) {
                zoomIn.onclick = function () {
                    zoom *= 1.2;
                    scale();
                };
            }
        }
        for (const zoomOut of zoomOuts) {
            if (zoomOut) {
                zoomOut.onclick = function () {
                    zoom /= 1.2;
                    scale();
                };
            }
        }

        // Create OSMD object and canvas
        openSheetMusicDisplay = new OpenSheetMusicDisplay(canvas, {
            autoResize: true,
            backend: backendType,
            //backend: "canvas",
            //cursorsOptions: [{type: 3, color: "#2bb8cd", alpha: 0.6, follow: true}], // highlight current measure instead of just a small vertical bar over approximate notes
            disableCursor: false,
            drawingParameters: compactMode ? "compact" : "default", // try compact (instead of default)
            drawPartNames: true, // try false
            // drawTitle: false,
            // drawSubtitle: false,
            drawFingerings: true,
            //fingeringPosition: "left", // Above/Below is default. try left or right. experimental: above, below.
            //fingeringPositionFromXML: false, // do this if you want them always left, for example.
            // fingeringInsideStafflines: "true", // default: false. true draws fingerings directly above/below notes
            setWantedStemDirectionByXml: true, // try false, which was previously the default behavior
            // drawUpToMeasureNumber: 3, // draws only up to measure 3, meaning it draws measure 1 to 3 of the piece.
            drawFromMeasureNumber: measureRangeStart,
            drawUpToMeasureNumber: measureRangeEnd,

            //drawMeasureNumbers: false, // disable drawing measure numbers
            //measureNumberInterval: 4, // draw measure numbers only every 4 bars (and at the beginning of a new system)
            useXMLMeasureNumbers: true, // read measure numbers from xml

            // coloring options
            coloringEnabled: true,
            // defaultColorNotehead: "#CC0055", // try setting a default color. default is black (undefined)
            // defaultColorStem: "#BB0099",

            autoBeam: false, // try true, OSMD Function Test AutoBeam sample
            autoBeamOptions: {
                beam_rests: false,
                beam_middle_rests_only: false,
                //groups: [[3,4], [1,1]],
                maintain_stem_directions: false
            },
            pageFormat: pageFormat,
            pageBackgroundColor: pageBackgroundColor,
            renderSingleHorizontalStaffline: singleHorizontalStaffline

            // tupletsBracketed: true, // creates brackets for all tuplets except triplets, even when not set by xml
            // tripletsBracketed: true,
            // tupletsRatioed: true, // unconventional; renders ratios for tuplets (3:2 instead of 3 for triplets)
        });
        openSheetMusicDisplay.TransposeCalculator = new TransposeCalculator(); // necessary for using osmd.Sheet.Transpose and osmd.Sheet.Instruments[i].Transpose
        //openSheetMusicDisplay.DrawSkyLine = true;
        //openSheetMusicDisplay.DrawBottomLine = true;
        //openSheetMusicDisplay.setDrawBoundingBox("GraphicalLabel", false);
        openSheetMusicDisplay.setLogLevel('info'); // set this to 'debug' if you want to see more detailed control flow information in console
        document.body.appendChild(canvas);

        window.addEventListener("keydown", function (e) {
            var event = window.event ? window.event : e;
            // left arrow key
            if (event.keyCode === 37) {
                openSheetMusicDisplay.cursor.previous();
            }
            // right arrow key
            if (event.keyCode === 39) {
                openSheetMusicDisplay.cursor.next();
            }
        });
        previousCursorBtn?.addEventListener("click", function () {
            openSheetMusicDisplay.cursor.previous();
        });
        nextCursorBtn.addEventListener("click", function () {
            openSheetMusicDisplay.cursor.next();
        });
        // resetCursorBtn.addEventListener("click", function () {
        //     openSheetMusicDisplay.cursor.reset();
        // });
        if (followCursorCheckbox) {
            followCursorCheckbox.onclick = function () {
                openSheetMusicDisplay.FollowCursor = !openSheetMusicDisplay.FollowCursor;
            }
        }
        hideCursorBtn.style.display = 'none'
        hideCursorBtn.addEventListener("click", function () {
            if (openSheetMusicDisplay.cursor) {
                openSheetMusicDisplay.cursor.hide();
                hideCursorBtn.style.display = 'none'
                showCursorBtn.style.display = 'block'
            } else {
                console.info("Can't hide cursor, as it was disabled (e.g. by drawingParameters).");
            }
        });
        showCursorBtn.addEventListener("click", function () {
            if (openSheetMusicDisplay.cursor) {
                openSheetMusicDisplay.cursor.show();
                hideCursorBtn.style.display = 'block'
                showCursorBtn.style.display = 'none'
            } else {
                console.info("Can't show cursor, as it was disabled (e.g. by drawingParameters).");
            }
        });

        // backendSelect.addEventListener("change", function (e) {
        //     var value = e.target.value;
        //     var createNewOsmd = true;

        //     if (createNewOsmd) {
        //         // clears the canvas element
        //         canvas.innerHTML = "";
        //         //openSheetMusicDisplay = new OpenSheetMusicDisplay(canvas, { backend: value }); // resets EngravingRules
        //         openSheetMusicDisplay.setOptions({backend: value});
        //         openSheetMusicDisplay.setLogLevel('info'); // set this to 'debug' if you want to get more detailed control flow information
        //     } else {
        //         // alternative, doesn't work yet, see setOptions():
        //         openSheetMusicDisplay.setOptions({ backend: value });
        //     }
        //     console.log("[OSMD] selectSampleOnChange addEventListener change");
        //     // selectSampleOnChange();
        // });
        if (transposeBtn && transpose) {
            transposeBtn.onclick = function () {
                var transposeValue = parseInt(transpose.value);
                openSheetMusicDisplay.Sheet.Transpose = transposeValue;
                openSheetMusicDisplay.updateGraphic();
                rerender();
            }
        }

        // TODO after selectSampleOnChange, the resize handler triggers immediately,
        //   so we render twice at the start of the demo.
        //   maybe delay the first osmd render, e.g. when window ready?
        if (paramOpenUrl) {
            if (openSheetMusicDisplay.getLogLevel() < 2) { // debug or trace
                console.log("[OSMD] selectSampleOnChange with " + paramOpenUrl);
            }
            // DEBUG: cause an error for a certain sample, for testing
            // if (paramOpenUrl.startsWith("Beethoven")) {
            //     paramOpenUrl.causeError();
            // }
            selectSampleOnChange(paramOpenUrl);
        } else {
            if (openSheetMusicDisplay.getLogLevel() < 2) { // debug or trace
                console.log("[OSMD] selectSampleOnChange without param");
            }
            selectSampleOnChange();
        }
    }

    function findGetParameter(parameterName) {
        // special treatment for the openUrl parameter, because different systems attach different arguments to an URL.
        // because of CORS (cross-origin safety restrictions), you can only load an xml file from the same origin (server).

        // test parameter: ?openUrl=https://opensheetmusiceducation.org/index.php?gf-download=2020%2F01%2FJohannSebastianBach_PraeludiumInCDur_BWV846_1.xml&endUrl&form-id=1&field-id=4&hash=c4ba271ef08204a26cbd4cd2d751c53b78f238c25ddbb1f343e1172f2ce2aa53
        //   (enable the console.log at the end of this method for testing)
        // working test parameter in local demo: ?openUrl=OSMD_function_test_all.xml&endUrl

        if (parameterName === 'openUrl') {
            let startParameterName = 'openUrl=';
            let endParameterName = '&endUrl';
            let openUrlIndex = location.search.indexOf(startParameterName);
            if (openUrlIndex < 0) {
                return undefined;
            }
            let endIndex = location.search.indexOf(endParameterName) + endParameterName.length;
            if (endIndex < 0) {
                console.log("[OSMD] If using openUrl as a parameter, you have to end it with '&endUrl'. openUrl parameter omitted.");
                return undefined;
            }
            let urlString = location.search.substring(openUrlIndex + startParameterName.length, endIndex - endParameterName.length);
            //console.log("openUrl: " + urlString);
            return urlString;
        }

        let result = undefined;
        let tmp = [];
        location.search
            .substr(1)
            .split('&')
            .forEach(function (item) {
                tmp = item.split('=');
                if (tmp[0] === parameterName) {
                    result = decodeURIComponent(tmp[1]);
                    //console.log('Found param:' + parameterName + ' = ' + result);
                }
            });
        return result;
    }

    function selectSampleOnChange(str) {
        error();
        disable();
        var isCustom = typeof str === "string";
        if (!isCustom) {
            if (selectSample) {
                str = sampleFolder + selectSample.value;
                localStorage.setItem('scorename', selectSample.value)
            } else {
                if (samples && samples.length > 0) {
                    str = sampleFolder + samples[0];
                } else {
                    return; // no sample to load right now
                }
            }
        }
        // zoom = 1.0;

        setSampleSpecificOptions(str, isCustom);

        openSheetMusicDisplay.load(str).then(
            function () {
                // This gives you access to the osmd object in the console. Do not use in production code
                window.osmd = openSheetMusicDisplay;
                openSheetMusicDisplay.zoom = zoom;
                //openSheetMusicDisplay.Sheet.Transpose = 3; // try transposing between load and first render if you have transpose issues with F# etc
                return openSheetMusicDisplay.render();
            },
            function (e) {
                errorLoadingOrRenderingSheet(e, "rendering");
            }
        ).then(
            function () {
                return onLoadingEnd(isCustom);
            }, function (e) {
                errorLoadingOrRenderingSheet(e, "loading");
                onLoadingEnd(isCustom);
            }
        );
    }

    function setSampleSpecificOptions(str, isCustom) {
        if (!isCustom && str.includes("measuresToDraw")) { // set options for measuresToDraw sample
            // stash previously set range of measures to draw
            if (!measureToDrawRangeNeedsReset) { // only stash once, when measuresToDraw called multiple times in a row
                minMeasureToDrawStashed = openSheetMusicDisplay.EngravingRules.MinMeasureToDrawIndex + 1;
                maxMeasureToDrawStashed = openSheetMusicDisplay.EngravingRules.MaxMeasureToDrawIndex + 1;
            }
            measureToDrawRangeNeedsReset = true;

            // for debugging: draw from a random range of measures
            let minMeasureToDraw = Math.ceil(Math.random() * 15); // measures start at 1 (measureIndex = measure number - 1 elsewhere)
            let maxMeasureToDraw = Math.ceil(Math.random() * 15);
            if (minMeasureToDraw > maxMeasureToDraw) {
                minMeasureToDraw = maxMeasureToDraw;
                let a = minMeasureToDraw;
                maxMeasureToDraw = a;
            }
            //minMeasureToDraw = 1; // set your custom indexes here. Drawing only one measure can be a special case
            //maxMeasureToDraw = 1;
            console.log("drawing measures in the range: [" + minMeasureToDraw + "," + maxMeasureToDraw + "]");
            openSheetMusicDisplay.setOptions({
                drawFromMeasureNumber: minMeasureToDraw,
                drawUpToMeasureNumber: maxMeasureToDraw
            });
        } else if (measureToDrawRangeNeedsReset) { // reset for other samples
            openSheetMusicDisplay.setOptions({
                drawFromMeasureNumber: minMeasureToDrawStashed,
                drawUpToMeasureNumber: maxMeasureToDrawStashed
            });
            measureToDrawRangeNeedsReset = false;
        }

        if (!isCustom && str.includes("Test_Container_height")) {
            drawingParametersStashed = openSheetMusicDisplay.drawingParameters.drawingParametersEnum;
            openSheetMusicDisplay.setOptions({
                drawingParameters: "compacttight"
            });
            drawingParametersNeedsReset = true;
        } else if (drawingParametersNeedsReset) {
            openSheetMusicDisplay.setOptions({
                drawingParameters: drawingParametersStashed
            });
            drawingParametersNeedsReset = false;
        }

        // Enable Boomwhacker-like coloring for OSMD Function Test - Auto-Coloring (Boomwhacker-like, custom color set)
        if (!isCustom && str.includes("auto-custom-coloring")) { // set options for auto coloring sample
            autoCustomColoringOptionNeedsReset = true;
            //openSheetMusicDisplay.setOptions({coloringMode: 1}); // Auto-Coloring with pre-defined colors
            openSheetMusicDisplay.setOptions({
                coloringMode: 2, // custom coloring set. 0 would be XML, 1 autocoloring
                coloringSetCustom: ["#d82c6b", "#F89D15", "#FFE21A", "#4dbd5c", "#009D96", "#43469d", "#76429c", "#ff0000"],
                // last color value of coloringSetCustom is for rest notes
                colorStemsLikeNoteheads: true
            });
        } else if (autoCustomColoringOptionNeedsReset) {
            openSheetMusicDisplay.setOptions({ // set default values. better would be to restore to stashed values, but unnecessarily complex for demo
                coloringMode: 0,
                colorStemsLikeNoteheads: false,
                coloringSetCustom: null
            });
            autoCustomColoringOptionNeedsReset = false;
        }
        if (!isCustom && str.includes("autobeam")) {
            autobeamOptionStashedValue = openSheetMusicDisplay.EngravingRules.AutoBeamNotes; // stash previously set value, to restore later
            autobeamOptionNeedsReset = true;
            openSheetMusicDisplay.setOptions({ autoBeam: true });
        } else if (autobeamOptionNeedsReset) {
            openSheetMusicDisplay.setOptions({ autoBeam: autobeamOptionStashedValue });
            autobeamOptionNeedsReset = false;
        }
        if (!isCustom && str.includes("OSMD_Function_Test_System_and_Page_Breaks")) {
            pageBreaksOptionStashedValue = openSheetMusicDisplay.EngravingRules.NewPageAtXMLNewPageAttribute;
            systemBreaksOptionStashedValue = openSheetMusicDisplay.EngravingRules.NewSystemAtXMLNewSystemAttribute;
            pageBreaksOptionNeedsReset = true;
            openSheetMusicDisplay.setOptions({ newPageFromXML: true, newSystemFromXML: true });
        }
        else if (pageBreaksOptionNeedsReset) {
            openSheetMusicDisplay.setOptions({ newPageFromXML: pageBreaksOptionStashedValue, newSystemFromXML: systemBreaksOptionStashedValue });
            pageBreaksOptionNeedsReset = false;
        }
        if (!isCustom && str.includes("Schubert_An_die_Musik")) { // TODO weird layout bug here with part names. but shouldn't be in score anyways
            drawPartNamesOptionStashedValue = openSheetMusicDisplay.EngravingRules.RenderPartNames;
            drawPartAbbreviationsStashedValue = openSheetMusicDisplay.EngravingRules.RenderPartAbbreviations;
            openSheetMusicDisplay.setOptions({ drawPartNames: false, drawPartAbbreviations: false }); // TODO sets osmd.drawingParameters.DrawPartNames! also check EngravingRules.RenderPartAbbreviations, was false
            drawPartNamesOptionNeedsReset = true;
        } else if (drawPartNamesOptionNeedsReset) {
            openSheetMusicDisplay.setOptions({ drawPartNames: drawPartNamesOptionStashedValue, drawPartAbbreviations: drawPartAbbreviationsStashedValue });
            drawPartNamesOptionNeedsReset = false;
        }
    }

    function errorLoadingOrRenderingSheet(e, loadingOrRenderingString) {
        var errorString = "Error " + loadingOrRenderingString + " sheet: " + e;
        // Always giving a StackTrace might give us more and better error reports.
        // TODO for a release, StackTrace control could be reenabled
        errorString += "\n" + "StackTrace: \n" + e.stack;
        // }
        console.warn(errorString);
    }

    function onLoadingEnd(isCustom) {
        // Remove option from select
        if (!isCustom && custom.parentElement === selectSample) {
            selectSample.removeChild(custom);
        }
        // Enable controls again
        enable();
    }

    function logCanvasSize() {
        for (const zoomDiv of zoomDivs) {
            if (zoomDiv) {
                zoomDiv.innerHTML = Math.floor(zoom * 100.0) + "%";
            }
        }
    }

    function scale() {
        disable();
        window.setTimeout(function () {
            openSheetMusicDisplay.Zoom = zoom;
            openSheetMusicDisplay.render();
            enable();
        }, 0);
    }

    function rerender() {
        disable();
        window.setTimeout(function () {
            if (openSheetMusicDisplay.IsReadyToRender()) {
                openSheetMusicDisplay.render();
            } else {
                console.log("[OSMD demo] Loses context!"); // TODO not sure that this message is reasonable, renders fine anyways. maybe vexflow context lost?
                selectSampleOnChange(); // reload sample e.g. after osmd.clear()
            }
            enable();
        }, 0);
    }

    function error(errString) {
        if (!errString) {
            error_tr.style.display = "none";
        } else {
            console.log("[OSMD demo] error: " + errString)
            err.textContent = errString;
            error_tr.style.display = "";
            canvas.width = canvas.height = 0;
            enable();
        }
    }

    // Enable/Disable Controls
    function disable() {
        document.body.style.opacity = 0.3;
        setDisabledForControls("disabled");
    }

    function enable() {
        document.body.style.opacity = 1;
        setDisabledForControls("");
        logCanvasSize();
    }

    function setDisabledForControls(disabledValue) {
        if (selectSample) {
            selectSample.disabled = disabledValue;
        }
        for (const zoomIn of zoomIns) {
            if (zoomIn) {
                zoomIn.disabled = disabledValue;
            }
        }
        for (const zoomOut of zoomOuts) {
            if (zoomOut) {
                zoomOut.disabled = disabledValue;
            }
        }
    }

    // Register events: load, drag&drop
    window.addEventListener("load", function () {
        init();
    });
    window.addEventListener("dragenter", function (event) {
        event.preventDefault();
        disable();
    });
    window.addEventListener("dragover", function (event) {
        event.preventDefault();
    });
    window.addEventListener("dragleave", function (event) {
        enable();
    });
    window.addEventListener("drop", function (event) {
        event.preventDefault();
        if (!event.dataTransfer || !event.dataTransfer.files || event.dataTransfer.files.length === 0) {
            return;
        }
        // Add "Custom..." score
        selectSample.appendChild(custom);
        custom.selected = "selected";
        // Read dragged file
        var reader = new FileReader();
        reader.onload = function (res) {
            selectSampleOnChange(res.target.result);
        };
        var filename = event.dataTransfer.files[0].name;
        if (filename.toLowerCase().indexOf(".xml") > 0
            || filename.toLowerCase().indexOf(".musicxml") > 0) {
            reader.readAsText(event.dataTransfer.files[0]);
        } else if (event.dataTransfer.files[0].name.toLowerCase().indexOf(".mxl") > 0) {
            reader.readAsBinaryString(event.dataTransfer.files[0]);
        }
        else {
            alert("No vaild .xml/.mxl/.musicxml file!");
        }
    });

    // timing
    var showTiming = document.getElementById('show-timing');
    var timingWrapper = document.getElementById('timing');
    var operator = document.getElementById('timing-operator');
    var countStage = document.getElementById('counting');
    var timeStage = document.getElementById('now');
    function to10(num) {
        if (num < 10) return '0' + num.toString()
        if (num === 0) return '00'
        return num
    }
    setInterval(() => {
        var d = new Date();
        timeStage.innerHTML = to10(d.getHours()) + ' : ' + to10(d.getMinutes()) + ' : ' + to10(d.getSeconds());
        countStage.innerHTML = to10(Math.floor(time / 60)) + ' : ' + to10(time % 60);
        if (isTiming) time += 1
    }, 1000)

    operator.onclick = function () {
        isTiming = true;
        time = 1
    }

    showTiming.onclick = function () {
        isShowTime = !isShowTime
        timingWrapper.style.display = isShowTime ? '' : 'none'
    }
}());
