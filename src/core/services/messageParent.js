
function message_parent(str) {
    if ( window.location !== window.parent.location ) { 
        console.log('we are a child window');

        window.top.postMessage(["messageFromChild", str], '*');
    }
    else {
        console.log('We are the parent window: unable to post');
    }
}

export const messageParent = jsonstr => {
    return message_parent(jsonstr);
};

export default messageParent;

