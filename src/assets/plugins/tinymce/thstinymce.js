const __lookups = [

    { button: 'FöreningID', value: '%COMPANY_ID%' },
    { button: 'FöreningNamn', value: '%COMPANY_NAME%' },
    { button: 'FöreningKontaktEpost', value: '%COMPANY_CONTACT_EMAIL%' },
    { button: 'FöreningKontaktTelefon', value: '%COMPANY_CONTACT_PHONE%' },
    { button: 'FöreningKontaktNamn', value: '%COMPANY_CONTACT_NAME%' },
    { button: 'FöreningOrgNummer', value: '%COMPANY_ORG_NUMBER%' },
    { button: 'FöreningLogo', value: '%COMPANY_LOGO%' },
    { button: 'FöreningPostort', value: '%COMPANY_POSTADDRESS%' },
    { button: 'FöreningAdress', value: '%COMPANY_ADDRESS%' },
    { button: 'FöreningPostkod', value: '%COMPANY_ZIP%' },
    { button: 'FöreningWeb', value: '%COMPANY_WWW%' },
    { button: 'FöreningSwish', value: '%COMPANY_SWISH%' },
    { button: 'FöreningMoms', value: '%COMPANY_VAT%' },
    { button: 'FöreningPlusgiro', value: '%COMPANY_PLUSGIRO%' },
    { button: 'FöreningBankgiro', value: '%COMPANY_BANKGIRO%' },

    { button: 'Medlemsnummer', value: '%CLIENT_PUBLIC_ID%' },
    { button: 'MedlemsID', value: '%CLIENT_ID%' },
    { button: 'MedlemFörnamn', value: '%CLIENT_FIRSTNAME%' },
    { button: 'MedlemEfternamn', value: '%CLIENT_LASTNAME%' },
    { button: 'MedlemEpost', value: '%CLIENT_EMAIL%' },
    { button: 'MedlemTelefon', value: '%CLIENT_PHONE%' },
    { button: 'MedlemAdress', value: '%CLIENT_ADDRESS%' },
    { button: 'MedlemPersonnr', value: '%CLIENT_PERSONNR%' },
    { button: 'MedlemPostort', value: '%CLIENT_POSTADDRESS%' },
    { button: 'MedlemPostkod', value: '%CLIENT_ZIPCODE%' },
    { button: 'MedlemToken', value: '%CLIENT_TOKEN%' },
    { button: 'MedlemStickprovUrl', value: '%STICKPROV_URL%' },

    { button: 'AnvändareInviteToken', value: '%USER_INVITE_TOKEN%' },
    { button: 'AnvändareID', value: '%USER_ID%' },
    { button: 'AnvändareEpost', value: '%USER_EMAIL%' },
    { button: 'AnvändareFörnamn', value: '%USER_FIRSTNAME%' },
    { button: 'AnvändareEfternamn', value: '%USER_LASTNAME%' },
    { button: 'AnvändareTelefon', value: '%USER_PHONE%' },
    { button: 'AnvändarePersonnr', value: '%USER_PERSONNR%' },
    { button: 'AnvändareValdFöreningID', value: '%USER_CURRENT_COMPANY_ID%' },

];


var __dialog = null;


window.tinymce.PluginManager.add('thsvariables', function (editor, url) {
        var openDialog = function () {

            return editor.windowManager.open({
                title: 'Dynamiska Variabler',
                body: {
                    type: 'tabpanel',
                    tabs: [ // array of tab panel configurations
                        {
                            name: 'company',
                            title: 'Föreningsdata',
                            items: [
                                {
                                    type: 'panel',
                                    title: 'Föreningsdata',
                                    items: [
                                        { value: 'test', type: 'button', text: 'FöreningNamn', on: function (e) { console.log('AAAA'); } },
                                        { type: 'button', text: 'FöreningOrgNummer' },
                                        { type: 'button', text: 'FöreningID' },
                                        { type: 'button', text: 'FöreningKontaktEpost' },
                                        { type: 'button', text: 'FöreningKontaktTelefon' },
                                        { type: 'button', text: 'FöreningKontaktNamn' },
                                        { type: 'button', text: 'FöreningLogo' },
                                        { type: 'button', text: 'FöreningPostort' },
                                        { type: 'button', text: 'FöreningAdress' },
                                        { type: 'button', text: 'FöreningPostkod' },
                                        { type: 'button', text: 'FöreningWeb' },
                                        { type: 'button', text: 'FöreningSwish' },
                                        { type: 'button', text: 'FöreningMoms' },
                                        { type: 'button', text: 'FöreningPlusgiro' },
                                        { type: 'button', text: 'FöreningBankgiro' },
                                    ]
                                }
                            ] // array of panel components
                        },
                        {
                            name: 'client',
                            title: 'Medlemsdata',
                            items: [
                                {
                                    type: 'panel',
                                    title: 'Medlemsdata',
                                    items: [
                                        { type: 'button', text: 'Medlemsnummer' },
                                        { type: 'button', text: 'MedlemsID' },
                                        { type: 'button', text: 'MedlemFörnamn' },
                                        { type: 'button', text: 'MedlemEfternamn' },
                                        { type: 'button', text: 'MedlemEpost' },
                                        { type: 'button', text: 'MedlemTelefon' },
                                        { type: 'button', text: 'MedlemAdress' },
                                        { type: 'button', text: 'MedlemPersonnr' },
                                        { type: 'button', text: 'MedlemPostort' },
                                        { type: 'button', text: 'MedlemPostkod' },
                                        { type: 'button', text: 'MedlemToken' },
                                        { type: 'button', text: 'MedlemStickprovUrl' },

                                    ]
                                }
                            ] // array of panel components
                        },
                        {
                            name: 'user',
                            title: 'Admindata',
                            items: [
                                {
                                    type: 'panel',
                                    title: 'Användardata',
                                    items: [
                                        { type: 'button', text: 'AnvändareID' },
                                        { type: 'button', text: 'AnvändareEpost' },
                                        { type: 'button', text: 'AnvändareFörnamn' },
                                        { type: 'button', text: 'AnvändareEfternamn' },
                                        { type: 'button', text: 'AnvändareTelefon' },
                                        { type: 'button', text: 'AnvändarePersonnr' },
                                        { type: 'button', text: 'AnvändareValdFöreningID' },
                                    ]
                                }
                            ] // array of panel components
                        },
                    ],
                },
                buttons: [
                    {
                        type: 'cancel',
                        text: 'Close'
                    },
                    {
                        type: 'submit',
                        text: 'Save',
                        primary: true
                    }
                ],
                onAction: function (a, b) {

                },
                onSubmit: function (api) {
                    var data = api.getData();

                    var win = api.control.rootControl;
                    console.log(JSON.stringify(win.toJSON()));  // just for testing, you don't need this line
                    // You can then access the results with this example
                    //editor.insertContent('Tab A name is ' + alldata.nameA + '; Tab B name is ' +  alldata.nameB);
                    //editor.insertContent('Tab A age is ' + alldata.ageA + '; Tab B age is ' +  alldata.ageB);

                    //console.log(data);

                    // Insert content when the window form is submitted
                    editor.insertContent('Title: ' + data.title);
                    api.close();
                },
                onTabChange: (dialogApi, details) => {
                    // log the contents of details
                    console.log(details.newTabName);
                    console.log(details.oldTabName);

                    // switch back to the old tab
                    dialogApi.showTab(details.newTabName);

                    $('button').on('click', function (e) {

                        let title = $(this).prop('title');

                        for (var i = 0; i < __lookups.length; ++i) {
                            if (__lookups[i].button == title) {
                                editor.insertContent(__lookups[i].value);
                                __dialog.close();
                                break;
                            }
                        }
                    });
                }
            });
        };

        // Add a button that opens a window
        editor.ui.registry.addButton('thsvariables', {
            text: 'Infoga Datavariabel',
            onAction: function () {
                // Open window

                __dialog = openDialog();
                $('button').on('click', function (e) {

                    let title = $(this).prop('title');

                    for (var i = 0; i < __lookups.length; ++i) {
                        if (__lookups[i].button == title) {
                            editor.insertContent(__lookups[i].value);
                            __dialog.close();
                            break;
                        }
                    }
                });
            }
        });

        // Adds a menu item, which can then be included in any menu via the menu/menubar configuration
        editor.ui.registry.addMenuItem('thsvariables', {
            text: 'Dynamiska Variabler',
            onAction: function () {
                // Open window
                openDialog();
            }
        });

        return {
            getMetadata: function () {
                return {
                    name: "Dynamiska Variabler",
                    url: ""
                };
            }
        };
    });


