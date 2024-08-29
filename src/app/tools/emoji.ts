/*
# source : https://unicode.org/Public/emoji/15.1/emoji-test.txt
#
# Date: 2023-06-05, 21:39:54 GMT
# © 2023 Unicode®, Inc.
# Unicode and the Unicode Logo are registered trademarks of Unicode, Inc. in the U.S. and other countries.
# For terms of use, see https://www.unicode.org/terms_of_use.html
#
# Emoji Keyboard/Display Test Data for UTS #51
# Version: 15.1
*/

// list of regexp apply on the source file (respect order):
// /.*(unqualified|minimally-qualified).*\n//
// /.*;.*# (.*) E\d+.*\n/$1,/
// /# subgroup: (.*)\n(.*),/'$1': '$2',/
// /.*subtotal.*\n.*subtotal.*/},/
// /# group: (.*)\n\n/'$1': {/

const emojiList = {
    'Smileys & Emotion': {
        'face-smiling': '😀,😃,😄,😁,😆,😅,🤣,😂,🙂,🙃,🫠,😉,😊,😇',
        'face-affection': '🥰,😍,🤩,😘,😗,☺️,😚,😙,🥲',
        'face-tongue': '😋,😛,😜,🤪,😝,🤑',
        'face-hand': '🤗,🤭,🫢,🫣,🤫,🤔,🫡',
        'face-neutral-skeptical': '🤐,🤨,😐,😑,😶,🫥,😶‍🌫️,😏,😒,🙄,😬,😮‍💨,🤥,🫨,🙂‍↔️,🙂‍↕️',
        'face-sleepy': '😌,😔,😪,🤤,😴',
        'face-unwell': '😷,🤒,🤕,🤢,🤮,🤧,🥵,🥶,🥴,😵,😵‍💫,🤯',
        'face-hat': '🤠,🥳,🥸',
        'face-glasses': '😎,🤓,🧐',
        'face-concerned': '😕,🫤,😟,🙁,☹️,😮,😯,😲,😳,🥺,🥹,😦,😧,😨,😰,😥,😢,😭,😱,😖,😣,😞,😓,😩,😫,🥱',
        'face-negative': '😤,😡,😠,🤬,😈,👿,💀,☠️',
        'face-costume': '💩,🤡,👹,👺,👻,👽,👾,🤖',
        'cat-face': '😺,😸,😹,😻,😼,😽,🙀,😿,😾',
        'monkey-face': '🙈,🙉,🙊',
        heart: '💌,💘,💝,💖,💗,💓,💞,💕,💟,❣️,💔,❤️‍🔥,❤️‍🩹,❤️,🩷,🧡,💛,💚,💙,🩵,💜,🤎,🖤,🩶,🤍',
        emotion: '💋,💯,💢,💥,💫,💦,💨,🕳️,💬,👁️‍🗨️,🗨️,🗯️,💭,💤',
    },

    'People & Body': {
        'hand-fingers-open':
            '👋,👋🏻,👋🏼,👋🏽,👋🏾,👋🏿,🤚,🤚🏻,🤚🏼,🤚🏽,🤚🏾,🤚🏿,🖐️,🖐🏻,🖐🏼,🖐🏽,🖐🏾,🖐🏿,✋,✋🏻,✋🏼,✋🏽,✋🏾,✋🏿,🖖,🖖🏻,🖖🏼,🖖🏽,🖖🏾,🖖🏿,🫱,🫱🏻,🫱🏼,🫱🏽,🫱🏾,🫱🏿,🫲,🫲🏻,🫲🏼,🫲🏽,🫲🏾,🫲🏿,🫳,🫳🏻,🫳🏼,🫳🏽,🫳🏾,🫳🏿,🫴,🫴🏻,🫴🏼,🫴🏽,🫴🏾,🫴🏿,🫷,🫷🏻,🫷🏼,🫷🏽,🫷🏾,🫷🏿,🫸,🫸🏻,🫸🏼,🫸🏽,🫸🏾,🫸🏿',
        'hand-fingers-partial':
            '👌,👌🏻,👌🏼,👌🏽,👌🏾,👌🏿,🤌,🤌🏻,🤌🏼,🤌🏽,🤌🏾,🤌🏿,🤏,🤏🏻,🤏🏼,🤏🏽,🤏🏾,🤏🏿,✌️,✌🏻,✌🏼,✌🏽,✌🏾,✌🏿,🤞,🤞🏻,🤞🏼,🤞🏽,🤞🏾,🤞🏿,🫰,🫰🏻,🫰🏼,🫰🏽,🫰🏾,🫰🏿,🤟,🤟🏻,🤟🏼,🤟🏽,🤟🏾,🤟🏿,🤘,🤘🏻,🤘🏼,🤘🏽,🤘🏾,🤘🏿,🤙,🤙🏻,🤙🏼,🤙🏽,🤙🏾,🤙🏿',
        'hand-single-finger':
            '👈,👈🏻,👈🏼,👈🏽,👈🏾,👈🏿,👉,👉🏻,👉🏼,👉🏽,👉🏾,👉🏿,👆,👆🏻,👆🏼,👆🏽,👆🏾,👆🏿,🖕,🖕🏻,🖕🏼,🖕🏽,🖕🏾,🖕🏿,👇,👇🏻,👇🏼,👇🏽,👇🏾,👇🏿,☝️,☝🏻,☝🏼,☝🏽,☝🏾,☝🏿,🫵,🫵🏻,🫵🏼,🫵🏽,🫵🏾,🫵🏿',
        'hand-fingers-closed':
            '👍,👍🏻,👍🏼,👍🏽,👍🏾,👍🏿,👎,👎🏻,👎🏼,👎🏽,👎🏾,👎🏿,✊,✊🏻,✊🏼,✊🏽,✊🏾,✊🏿,👊,👊🏻,👊🏼,👊🏽,👊🏾,👊🏿,🤛,🤛🏻,🤛🏼,🤛🏽,🤛🏾,🤛🏿,🤜,🤜🏻,🤜🏼,🤜🏽,🤜🏾,🤜🏿',
        hands: '👏,👏🏻,👏🏼,👏🏽,👏🏾,👏🏿,🙌,🙌🏻,🙌🏼,🙌🏽,🙌🏾,🙌🏿,🫶,🫶🏻,🫶🏼,🫶🏽,🫶🏾,🫶🏿,👐,👐🏻,👐🏼,👐🏽,👐🏾,👐🏿,🤲,🤲🏻,🤲🏼,🤲🏽,🤲🏾,🤲🏿,🤝,🤝🏻,🤝🏼,🤝🏽,🤝🏾,🤝🏿,🫱🏻‍🫲🏼,🫱🏻‍🫲🏽,🫱🏻‍🫲🏾,🫱🏻‍🫲🏿,🫱🏼‍🫲🏻,🫱🏼‍🫲🏽,🫱🏼‍🫲🏾,🫱🏼‍🫲🏿,🫱🏽‍🫲🏻,🫱🏽‍🫲🏼,🫱🏽‍🫲🏾,🫱🏽‍🫲🏿,🫱🏾‍🫲🏻,🫱🏾‍🫲🏼,🫱🏾‍🫲🏽,🫱🏾‍🫲🏿,🫱🏿‍🫲🏻,🫱🏿‍🫲🏼,🫱🏿‍🫲🏽,🫱🏿‍🫲🏾,🙏,🙏🏻,🙏🏼,🙏🏽,🙏🏾,🙏🏿',
        'hand-prop': '✍️,✍🏻,✍🏼,✍🏽,✍🏾,✍🏿,💅,💅🏻,💅🏼,💅🏽,💅🏾,💅🏿,🤳,🤳🏻,🤳🏼,🤳🏽,🤳🏾,🤳🏿',
        'body-parts':
            '💪,💪🏻,💪🏼,💪🏽,💪🏾,💪🏿,🦾,🦿,🦵,🦵🏻,🦵🏼,🦵🏽,🦵🏾,🦵🏿,🦶,🦶🏻,🦶🏼,🦶🏽,🦶🏾,🦶🏿,👂,👂🏻,👂🏼,👂🏽,👂🏾,👂🏿,🦻,🦻🏻,🦻🏼,🦻🏽,🦻🏾,🦻🏿,👃,👃🏻,👃🏼,👃🏽,👃🏾,👃🏿,🧠,🫀,🫁,🦷,🦴,👀,👁️,👅,👄,🫦',
        person: '👶,👶🏻,👶🏼,👶🏽,👶🏾,👶🏿,🧒,🧒🏻,🧒🏼,🧒🏽,🧒🏾,🧒🏿,👦,👦🏻,👦🏼,👦🏽,👦🏾,👦🏿,👧,👧🏻,👧🏼,👧🏽,👧🏾,👧🏿,🧑,🧑🏻,🧑🏼,🧑🏽,🧑🏾,🧑🏿,👱,👱🏻,👱🏼,👱🏽,👱🏾,👱🏿,👨,👨🏻,👨🏼,👨🏽,👨🏾,👨🏿,🧔,🧔🏻,🧔🏼,🧔🏽,🧔🏾,🧔🏿,🧔‍♂️,🧔🏻‍♂️,🧔🏼‍♂️,🧔🏽‍♂️,🧔🏾‍♂️,🧔🏿‍♂️,🧔‍♀️,🧔🏻‍♀️,🧔🏼‍♀️,🧔🏽‍♀️,🧔🏾‍♀️,🧔🏿‍♀️,👨‍🦰,👨🏻‍🦰,👨🏼‍🦰,👨🏽‍🦰,👨🏾‍🦰,👨🏿‍🦰,👨‍🦱,👨🏻‍🦱,👨🏼‍🦱,👨🏽‍🦱,👨🏾‍🦱,👨🏿‍🦱,👨‍🦳,👨🏻‍🦳,👨🏼‍🦳,👨🏽‍🦳,👨🏾‍🦳,👨🏿‍🦳,👨‍🦲,👨🏻‍🦲,👨🏼‍🦲,👨🏽‍🦲,👨🏾‍🦲,👨🏿‍🦲,👩,👩🏻,👩🏼,👩🏽,👩🏾,👩🏿,👩‍🦰,👩🏻‍🦰,👩🏼‍🦰,👩🏽‍🦰,👩🏾‍🦰,👩🏿‍🦰,🧑‍🦰,🧑🏻‍🦰,🧑🏼‍🦰,🧑🏽‍🦰,🧑🏾‍🦰,🧑🏿‍🦰,👩‍🦱,👩🏻‍🦱,👩🏼‍🦱,👩🏽‍🦱,👩🏾‍🦱,👩🏿‍🦱,🧑‍🦱,🧑🏻‍🦱,🧑🏼‍🦱,🧑🏽‍🦱,🧑🏾‍🦱,🧑🏿‍🦱,👩‍🦳,👩🏻‍🦳,👩🏼‍🦳,👩🏽‍🦳,👩🏾‍🦳,👩🏿‍🦳,🧑‍🦳,🧑🏻‍🦳,🧑🏼‍🦳,🧑🏽‍🦳,🧑🏾‍🦳,🧑🏿‍🦳,👩‍🦲,👩🏻‍🦲,👩🏼‍🦲,👩🏽‍🦲,👩🏾‍🦲,👩🏿‍🦲,🧑‍🦲,🧑🏻‍🦲,🧑🏼‍🦲,🧑🏽‍🦲,🧑🏾‍🦲,🧑🏿‍🦲,👱‍♀️,👱🏻‍♀️,👱🏼‍♀️,👱🏽‍♀️,👱🏾‍♀️,👱🏿‍♀️,👱‍♂️,👱🏻‍♂️,👱🏼‍♂️,👱🏽‍♂️,👱🏾‍♂️,👱🏿‍♂️,🧓,🧓🏻,🧓🏼,🧓🏽,🧓🏾,🧓🏿,👴,👴🏻,👴🏼,👴🏽,👴🏾,👴🏿,👵,👵🏻,👵🏼,👵🏽,👵🏾,👵🏿',
        'person-gesture':
            '🙍,🙍🏻,🙍🏼,🙍🏽,🙍🏾,🙍🏿,🙍‍♂️,🙍🏻‍♂️,🙍🏼‍♂️,🙍🏽‍♂️,🙍🏾‍♂️,🙍🏿‍♂️,🙍‍♀️,🙍🏻‍♀️,🙍🏼‍♀️,🙍🏽‍♀️,🙍🏾‍♀️,🙍🏿‍♀️,🙎,🙎🏻,🙎🏼,🙎🏽,🙎🏾,🙎🏿,🙎‍♂️,🙎🏻‍♂️,🙎🏼‍♂️,🙎🏽‍♂️,🙎🏾‍♂️,🙎🏿‍♂️,🙎‍♀️,🙎🏻‍♀️,🙎🏼‍♀️,🙎🏽‍♀️,🙎🏾‍♀️,🙎🏿‍♀️,🙅,🙅🏻,🙅🏼,🙅🏽,🙅🏾,🙅🏿,🙅‍♂️,🙅🏻‍♂️,🙅🏼‍♂️,🙅🏽‍♂️,🙅🏾‍♂️,🙅🏿‍♂️,🙅‍♀️,🙅🏻‍♀️,🙅🏼‍♀️,🙅🏽‍♀️,🙅🏾‍♀️,🙅🏿‍♀️,🙆,🙆🏻,🙆🏼,🙆🏽,🙆🏾,🙆🏿,🙆‍♂️,🙆🏻‍♂️,🙆🏼‍♂️,🙆🏽‍♂️,🙆🏾‍♂️,🙆🏿‍♂️,🙆‍♀️,🙆🏻‍♀️,🙆🏼‍♀️,🙆🏽‍♀️,🙆🏾‍♀️,🙆🏿‍♀️,💁,💁🏻,💁🏼,💁🏽,💁🏾,💁🏿,💁‍♂️,💁🏻‍♂️,💁🏼‍♂️,💁🏽‍♂️,💁🏾‍♂️,💁🏿‍♂️,💁‍♀️,💁🏻‍♀️,💁🏼‍♀️,💁🏽‍♀️,💁🏾‍♀️,💁🏿‍♀️,🙋,🙋🏻,🙋🏼,🙋🏽,🙋🏾,🙋🏿,🙋‍♂️,🙋🏻‍♂️,🙋🏼‍♂️,🙋🏽‍♂️,🙋🏾‍♂️,🙋🏿‍♂️,🙋‍♀️,🙋🏻‍♀️,🙋🏼‍♀️,🙋🏽‍♀️,🙋🏾‍♀️,🙋🏿‍♀️,🧏,🧏🏻,🧏🏼,🧏🏽,🧏🏾,🧏🏿,🧏‍♂️,🧏🏻‍♂️,🧏🏼‍♂️,🧏🏽‍♂️,🧏🏾‍♂️,🧏🏿‍♂️,🧏‍♀️,🧏🏻‍♀️,🧏🏼‍♀️,🧏🏽‍♀️,🧏🏾‍♀️,🧏🏿‍♀️,🙇,🙇🏻,🙇🏼,🙇🏽,🙇🏾,🙇🏿,🙇‍♂️,🙇🏻‍♂️,🙇🏼‍♂️,🙇🏽‍♂️,🙇🏾‍♂️,🙇🏿‍♂️,🙇‍♀️,🙇🏻‍♀️,🙇🏼‍♀️,🙇🏽‍♀️,🙇🏾‍♀️,🙇🏿‍♀️,🤦,🤦🏻,🤦🏼,🤦🏽,🤦🏾,🤦🏿,🤦‍♂️,🤦🏻‍♂️,🤦🏼‍♂️,🤦🏽‍♂️,🤦🏾‍♂️,🤦🏿‍♂️,🤦‍♀️,🤦🏻‍♀️,🤦🏼‍♀️,🤦🏽‍♀️,🤦🏾‍♀️,🤦🏿‍♀️,🤷,🤷🏻,🤷🏼,🤷🏽,🤷🏾,🤷🏿,🤷‍♂️,🤷🏻‍♂️,🤷🏼‍♂️,🤷🏽‍♂️,🤷🏾‍♂️,🤷🏿‍♂️,🤷‍♀️,🤷🏻‍♀️,🤷🏼‍♀️,🤷🏽‍♀️,🤷🏾‍♀️,🤷🏿‍♀️',
        'person-role':
            '🧑‍⚕️,🧑🏻‍⚕️,🧑🏼‍⚕️,🧑🏽‍⚕️,🧑🏾‍⚕️,🧑🏿‍⚕️,👨‍⚕️,👨🏻‍⚕️,👨🏼‍⚕️,👨🏽‍⚕️,👨🏾‍⚕️,👨🏿‍⚕️,👩‍⚕️,👩🏻‍⚕️,👩🏼‍⚕️,👩🏽‍⚕️,👩🏾‍⚕️,👩🏿‍⚕️,🧑‍🎓,🧑🏻‍🎓,🧑🏼‍🎓,🧑🏽‍🎓,🧑🏾‍🎓,🧑🏿‍🎓,👨‍🎓,👨🏻‍🎓,👨🏼‍🎓,👨🏽‍🎓,👨🏾‍🎓,👨🏿‍🎓,👩‍🎓,👩🏻‍🎓,👩🏼‍🎓,👩🏽‍🎓,👩🏾‍🎓,👩🏿‍🎓,🧑‍🏫,🧑🏻‍🏫,🧑🏼‍🏫,🧑🏽‍🏫,🧑🏾‍🏫,🧑🏿‍🏫,👨‍🏫,👨🏻‍🏫,👨🏼‍🏫,👨🏽‍🏫,👨🏾‍🏫,👨🏿‍🏫,👩‍🏫,👩🏻‍🏫,👩🏼‍🏫,👩🏽‍🏫,👩🏾‍🏫,👩🏿‍🏫,🧑‍⚖️,🧑🏻‍⚖️,🧑🏼‍⚖️,🧑🏽‍⚖️,🧑🏾‍⚖️,🧑🏿‍⚖️,👨‍⚖️,👨🏻‍⚖️,👨🏼‍⚖️,👨🏽‍⚖️,👨🏾‍⚖️,👨🏿‍⚖️,👩‍⚖️,👩🏻‍⚖️,👩🏼‍⚖️,👩🏽‍⚖️,👩🏾‍⚖️,👩🏿‍⚖️,🧑‍🌾,🧑🏻‍🌾,🧑🏼‍🌾,🧑🏽‍🌾,🧑🏾‍🌾,🧑🏿‍🌾,👨‍🌾,👨🏻‍🌾,👨🏼‍🌾,👨🏽‍🌾,👨🏾‍🌾,👨🏿‍🌾,👩‍🌾,👩🏻‍🌾,👩🏼‍🌾,👩🏽‍🌾,👩🏾‍🌾,👩🏿‍🌾,🧑‍🍳,🧑🏻‍🍳,🧑🏼‍🍳,🧑🏽‍🍳,🧑🏾‍🍳,🧑🏿‍🍳,👨‍🍳,👨🏻‍🍳,👨🏼‍🍳,👨🏽‍🍳,👨🏾‍🍳,👨🏿‍🍳,👩‍🍳,👩🏻‍🍳,👩🏼‍🍳,👩🏽‍🍳,👩🏾‍🍳,👩🏿‍🍳,🧑‍🔧,🧑🏻‍🔧,🧑🏼‍🔧,🧑🏽‍🔧,🧑🏾‍🔧,🧑🏿‍🔧,👨‍🔧,👨🏻‍🔧,👨🏼‍🔧,👨🏽‍🔧,👨🏾‍🔧,👨🏿‍🔧,👩‍🔧,👩🏻‍🔧,👩🏼‍🔧,👩🏽‍🔧,👩🏾‍🔧,👩🏿‍🔧,🧑‍🏭,🧑🏻‍🏭,🧑🏼‍🏭,🧑🏽‍🏭,🧑🏾‍🏭,🧑🏿‍🏭,👨‍🏭,👨🏻‍🏭,👨🏼‍🏭,👨🏽‍🏭,👨🏾‍🏭,👨🏿‍🏭,👩‍🏭,👩🏻‍🏭,👩🏼‍🏭,👩🏽‍🏭,👩🏾‍🏭,👩🏿‍🏭,🧑‍💼,🧑🏻‍💼,🧑🏼‍💼,🧑🏽‍💼,🧑🏾‍💼,🧑🏿‍💼,👨‍💼,👨🏻‍💼,👨🏼‍💼,👨🏽‍💼,👨🏾‍💼,👨🏿‍💼,👩‍💼,👩🏻‍💼,👩🏼‍💼,👩🏽‍💼,👩🏾‍💼,👩🏿‍💼,🧑‍🔬,🧑🏻‍🔬,🧑🏼‍🔬,🧑🏽‍🔬,🧑🏾‍🔬,🧑🏿‍🔬,👨‍🔬,👨🏻‍🔬,👨🏼‍🔬,👨🏽‍🔬,👨🏾‍🔬,👨🏿‍🔬,👩‍🔬,👩🏻‍🔬,👩🏼‍🔬,👩🏽‍🔬,👩🏾‍🔬,👩🏿‍🔬,🧑‍💻,🧑🏻‍💻,🧑🏼‍💻,🧑🏽‍💻,🧑🏾‍💻,🧑🏿‍💻,👨‍💻,👨🏻‍💻,👨🏼‍💻,👨🏽‍💻,👨🏾‍💻,👨🏿‍💻,👩‍💻,👩🏻‍💻,👩🏼‍💻,👩🏽‍💻,👩🏾‍💻,👩🏿‍💻,🧑‍🎤,🧑🏻‍🎤,🧑🏼‍🎤,🧑🏽‍🎤,🧑🏾‍🎤,🧑🏿‍🎤,👨‍🎤,👨🏻‍🎤,👨🏼‍🎤,👨🏽‍🎤,👨🏾‍🎤,👨🏿‍🎤,👩‍🎤,👩🏻‍🎤,👩🏼‍🎤,👩🏽‍🎤,👩🏾‍🎤,👩🏿‍🎤,🧑‍🎨,🧑🏻‍🎨,🧑🏼‍🎨,🧑🏽‍🎨,🧑🏾‍🎨,🧑🏿‍🎨,👨‍🎨,👨🏻‍🎨,👨🏼‍🎨,👨🏽‍🎨,👨🏾‍🎨,👨🏿‍🎨,👩‍🎨,👩🏻‍🎨,👩🏼‍🎨,👩🏽‍🎨,👩🏾‍🎨,👩🏿‍🎨,🧑‍✈️,🧑🏻‍✈️,🧑🏼‍✈️,🧑🏽‍✈️,🧑🏾‍✈️,🧑🏿‍✈️,👨‍✈️,👨🏻‍✈️,👨🏼‍✈️,👨🏽‍✈️,👨🏾‍✈️,👨🏿‍✈️,👩‍✈️,👩🏻‍✈️,👩🏼‍✈️,👩🏽‍✈️,👩🏾‍✈️,👩🏿‍✈️,🧑‍🚀,🧑🏻‍🚀,🧑🏼‍🚀,🧑🏽‍🚀,🧑🏾‍🚀,🧑🏿‍🚀,👨‍🚀,👨🏻‍🚀,👨🏼‍🚀,👨🏽‍🚀,👨🏾‍🚀,👨🏿‍🚀,👩‍🚀,👩🏻‍🚀,👩🏼‍🚀,👩🏽‍🚀,👩🏾‍🚀,👩🏿‍🚀,🧑‍🚒,🧑🏻‍🚒,🧑🏼‍🚒,🧑🏽‍🚒,🧑🏾‍🚒,🧑🏿‍🚒,👨‍🚒,👨🏻‍🚒,👨🏼‍🚒,👨🏽‍🚒,👨🏾‍🚒,👨🏿‍🚒,👩‍🚒,👩🏻‍🚒,👩🏼‍🚒,👩🏽‍🚒,👩🏾‍🚒,👩🏿‍🚒,👮,👮🏻,👮🏼,👮🏽,👮🏾,👮🏿,👮‍♂️,👮🏻‍♂️,👮🏼‍♂️,👮🏽‍♂️,👮🏾‍♂️,👮🏿‍♂️,👮‍♀️,👮🏻‍♀️,👮🏼‍♀️,👮🏽‍♀️,👮🏾‍♀️,👮🏿‍♀️,🕵️,🕵🏻,🕵🏼,🕵🏽,🕵🏾,🕵🏿,🕵️‍♂️,🕵🏻‍♂️,🕵🏼‍♂️,🕵🏽‍♂️,🕵🏾‍♂️,🕵🏿‍♂️,🕵️‍♀️,🕵🏻‍♀️,🕵🏼‍♀️,🕵🏽‍♀️,🕵🏾‍♀️,🕵🏿‍♀️,💂,💂🏻,💂🏼,💂🏽,💂🏾,💂🏿,💂‍♂️,💂🏻‍♂️,💂🏼‍♂️,💂🏽‍♂️,💂🏾‍♂️,💂🏿‍♂️,💂‍♀️,💂🏻‍♀️,💂🏼‍♀️,💂🏽‍♀️,💂🏾‍♀️,💂🏿‍♀️,🥷,🥷🏻,🥷🏼,🥷🏽,🥷🏾,🥷🏿,👷,👷🏻,👷🏼,👷🏽,👷🏾,👷🏿,👷‍♂️,👷🏻‍♂️,👷🏼‍♂️,👷🏽‍♂️,👷🏾‍♂️,👷🏿‍♂️,👷‍♀️,👷🏻‍♀️,👷🏼‍♀️,👷🏽‍♀️,👷🏾‍♀️,👷🏿‍♀️,🫅,🫅🏻,🫅🏼,🫅🏽,🫅🏾,🫅🏿,🤴,🤴🏻,🤴🏼,🤴🏽,🤴🏾,🤴🏿,👸,👸🏻,👸🏼,👸🏽,👸🏾,👸🏿,👳,👳🏻,👳🏼,👳🏽,👳🏾,👳🏿,👳‍♂️,👳🏻‍♂️,👳🏼‍♂️,👳🏽‍♂️,👳🏾‍♂️,👳🏿‍♂️,👳‍♀️,👳🏻‍♀️,👳🏼‍♀️,👳🏽‍♀️,👳🏾‍♀️,👳🏿‍♀️,👲,👲🏻,👲🏼,👲🏽,👲🏾,👲🏿,🧕,🧕🏻,🧕🏼,🧕🏽,🧕🏾,🧕🏿,🤵,🤵🏻,🤵🏼,🤵🏽,🤵🏾,🤵🏿,🤵‍♂️,🤵🏻‍♂️,🤵🏼‍♂️,🤵🏽‍♂️,🤵🏾‍♂️,🤵🏿‍♂️,🤵‍♀️,🤵🏻‍♀️,🤵🏼‍♀️,🤵🏽‍♀️,🤵🏾‍♀️,🤵🏿‍♀️,👰,👰🏻,👰🏼,👰🏽,👰🏾,👰🏿,👰‍♂️,👰🏻‍♂️,👰🏼‍♂️,👰🏽‍♂️,👰🏾‍♂️,👰🏿‍♂️,👰‍♀️,👰🏻‍♀️,👰🏼‍♀️,👰🏽‍♀️,👰🏾‍♀️,👰🏿‍♀️,🤰,🤰🏻,🤰🏼,🤰🏽,🤰🏾,🤰🏿,🫃,🫃🏻,🫃🏼,🫃🏽,🫃🏾,🫃🏿,🫄,🫄🏻,🫄🏼,🫄🏽,🫄🏾,🫄🏿,🤱,🤱🏻,🤱🏼,🤱🏽,🤱🏾,🤱🏿,👩‍🍼,👩🏻‍🍼,👩🏼‍🍼,👩🏽‍🍼,👩🏾‍🍼,👩🏿‍🍼,👨‍🍼,👨🏻‍🍼,👨🏼‍🍼,👨🏽‍🍼,👨🏾‍🍼,👨🏿‍🍼,🧑‍🍼,🧑🏻‍🍼,🧑🏼‍🍼,🧑🏽‍🍼,🧑🏾‍🍼,🧑🏿‍🍼',
        'person-fantasy':
            '👼,👼🏻,👼🏼,👼🏽,👼🏾,👼🏿,🎅,🎅🏻,🎅🏼,🎅🏽,🎅🏾,🎅🏿,🤶,🤶🏻,🤶🏼,🤶🏽,🤶🏾,🤶🏿,🧑‍🎄,🧑🏻‍🎄,🧑🏼‍🎄,🧑🏽‍🎄,🧑🏾‍🎄,🧑🏿‍🎄,🦸,🦸🏻,🦸🏼,🦸🏽,🦸🏾,🦸🏿,🦸‍♂️,🦸🏻‍♂️,🦸🏼‍♂️,🦸🏽‍♂️,🦸🏾‍♂️,🦸🏿‍♂️,🦸‍♀️,🦸🏻‍♀️,🦸🏼‍♀️,🦸🏽‍♀️,🦸🏾‍♀️,🦸🏿‍♀️,🦹,🦹🏻,🦹🏼,🦹🏽,🦹🏾,🦹🏿,🦹‍♂️,🦹🏻‍♂️,🦹🏼‍♂️,🦹🏽‍♂️,🦹🏾‍♂️,🦹🏿‍♂️,🦹‍♀️,🦹🏻‍♀️,🦹🏼‍♀️,🦹🏽‍♀️,🦹🏾‍♀️,🦹🏿‍♀️,🧙,🧙🏻,🧙🏼,🧙🏽,🧙🏾,🧙🏿,🧙‍♂️,🧙🏻‍♂️,🧙🏼‍♂️,🧙🏽‍♂️,🧙🏾‍♂️,🧙🏿‍♂️,🧙‍♀️,🧙🏻‍♀️,🧙🏼‍♀️,🧙🏽‍♀️,🧙🏾‍♀️,🧙🏿‍♀️,🧚,🧚🏻,🧚🏼,🧚🏽,🧚🏾,🧚🏿,🧚‍♂️,🧚🏻‍♂️,🧚🏼‍♂️,🧚🏽‍♂️,🧚🏾‍♂️,🧚🏿‍♂️,🧚‍♀️,🧚🏻‍♀️,🧚🏼‍♀️,🧚🏽‍♀️,🧚🏾‍♀️,🧚🏿‍♀️,🧛,🧛🏻,🧛🏼,🧛🏽,🧛🏾,🧛🏿,🧛‍♂️,🧛🏻‍♂️,🧛🏼‍♂️,🧛🏽‍♂️,🧛🏾‍♂️,🧛🏿‍♂️,🧛‍♀️,🧛🏻‍♀️,🧛🏼‍♀️,🧛🏽‍♀️,🧛🏾‍♀️,🧛🏿‍♀️,🧜,🧜🏻,🧜🏼,🧜🏽,🧜🏾,🧜🏿,🧜‍♂️,🧜🏻‍♂️,🧜🏼‍♂️,🧜🏽‍♂️,🧜🏾‍♂️,🧜🏿‍♂️,🧜‍♀️,🧜🏻‍♀️,🧜🏼‍♀️,🧜🏽‍♀️,🧜🏾‍♀️,🧜🏿‍♀️,🧝,🧝🏻,🧝🏼,🧝🏽,🧝🏾,🧝🏿,🧝‍♂️,🧝🏻‍♂️,🧝🏼‍♂️,🧝🏽‍♂️,🧝🏾‍♂️,🧝🏿‍♂️,🧝‍♀️,🧝🏻‍♀️,🧝🏼‍♀️,🧝🏽‍♀️,🧝🏾‍♀️,🧝🏿‍♀️,🧞,🧞‍♂️,🧞‍♀️,🧟,🧟‍♂️,🧟‍♀️,🧌',
        'person-activity':
            '💆,💆🏻,💆🏼,💆🏽,💆🏾,💆🏿,💆‍♂️,💆🏻‍♂️,💆🏼‍♂️,💆🏽‍♂️,💆🏾‍♂️,💆🏿‍♂️,💆‍♀️,💆🏻‍♀️,💆🏼‍♀️,💆🏽‍♀️,💆🏾‍♀️,💆🏿‍♀️,💇,💇🏻,💇🏼,💇🏽,💇🏾,💇🏿,💇‍♂️,💇🏻‍♂️,💇🏼‍♂️,💇🏽‍♂️,💇🏾‍♂️,💇🏿‍♂️,💇‍♀️,💇🏻‍♀️,💇🏼‍♀️,💇🏽‍♀️,💇🏾‍♀️,💇🏿‍♀️,🚶,🚶🏻,🚶🏼,🚶🏽,🚶🏾,🚶🏿,🚶‍♂️,🚶🏻‍♂️,🚶🏼‍♂️,🚶🏽‍♂️,🚶🏾‍♂️,🚶🏿‍♂️,🚶‍♀️,🚶🏻‍♀️,🚶🏼‍♀️,🚶🏽‍♀️,🚶🏾‍♀️,🚶🏿‍♀️,🚶‍➡️,🚶🏻‍➡️,🚶🏼‍➡️,🚶🏽‍➡️,🚶🏾‍➡️,🚶🏿‍➡️,🚶‍♀️‍➡️,🚶🏻‍♀️‍➡️,🚶🏼‍♀️‍➡️,🚶🏽‍♀️‍➡️,🚶🏾‍♀️‍➡️,🚶🏿‍♀️‍➡️,🚶‍♂️‍➡️,🚶🏻‍♂️‍➡️,🚶🏼‍♂️‍➡️,🚶🏽‍♂️‍➡️,🚶🏾‍♂️‍➡️,🚶🏿‍♂️‍➡️,🧍,🧍🏻,🧍🏼,🧍🏽,🧍🏾,🧍🏿,🧍‍♂️,🧍🏻‍♂️,🧍🏼‍♂️,🧍🏽‍♂️,🧍🏾‍♂️,🧍🏿‍♂️,🧍‍♀️,🧍🏻‍♀️,🧍🏼‍♀️,🧍🏽‍♀️,🧍🏾‍♀️,🧍🏿‍♀️,🧎,🧎🏻,🧎🏼,🧎🏽,🧎🏾,🧎🏿,🧎‍♂️,🧎🏻‍♂️,🧎🏼‍♂️,🧎🏽‍♂️,🧎🏾‍♂️,🧎🏿‍♂️,🧎‍♀️,🧎🏻‍♀️,🧎🏼‍♀️,🧎🏽‍♀️,🧎🏾‍♀️,🧎🏿‍♀️,🧎‍➡️,🧎🏻‍➡️,🧎🏼‍➡️,🧎🏽‍➡️,🧎🏾‍➡️,🧎🏿‍➡️,🧎‍♀️‍➡️,🧎🏻‍♀️‍➡️,🧎🏼‍♀️‍➡️,🧎🏽‍♀️‍➡️,🧎🏾‍♀️‍➡️,🧎🏿‍♀️‍➡️,🧎‍♂️‍➡️,🧎🏻‍♂️‍➡️,🧎🏼‍♂️‍➡️,🧎🏽‍♂️‍➡️,🧎🏾‍♂️‍➡️,🧎🏿‍♂️‍➡️,🧑‍🦯,🧑🏻‍🦯,🧑🏼‍🦯,🧑🏽‍🦯,🧑🏾‍🦯,🧑🏿‍🦯,🧑‍🦯‍➡️,🧑🏻‍🦯‍➡️,🧑🏼‍🦯‍➡️,🧑🏽‍🦯‍➡️,🧑🏾‍🦯‍➡️,🧑🏿‍🦯‍➡️,👨‍🦯,👨🏻‍🦯,👨🏼‍🦯,👨🏽‍🦯,👨🏾‍🦯,👨🏿‍🦯,👨‍🦯‍➡️,👨🏻‍🦯‍➡️,👨🏼‍🦯‍➡️,👨🏽‍🦯‍➡️,👨🏾‍🦯‍➡️,👨🏿‍🦯‍➡️,👩‍🦯,👩🏻‍🦯,👩🏼‍🦯,👩🏽‍🦯,👩🏾‍🦯,👩🏿‍🦯,👩‍🦯‍➡️,👩🏻‍🦯‍➡️,👩🏼‍🦯‍➡️,👩🏽‍🦯‍➡️,👩🏾‍🦯‍➡️,👩🏿‍🦯‍➡️,🧑‍🦼,🧑🏻‍🦼,🧑🏼‍🦼,🧑🏽‍🦼,🧑🏾‍🦼,🧑🏿‍🦼,🧑‍🦼‍➡️,🧑🏻‍🦼‍➡️,🧑🏼‍🦼‍➡️,🧑🏽‍🦼‍➡️,🧑🏾‍🦼‍➡️,🧑🏿‍🦼‍➡️,👨‍🦼,👨🏻‍🦼,👨🏼‍🦼,👨🏽‍🦼,👨🏾‍🦼,👨🏿‍🦼,👨‍🦼‍➡️,👨🏻‍🦼‍➡️,👨🏼‍🦼‍➡️,👨🏽‍🦼‍➡️,👨🏾‍🦼‍➡️,👨🏿‍🦼‍➡️,👩‍🦼,👩🏻‍🦼,👩🏼‍🦼,👩🏽‍🦼,👩🏾‍🦼,👩🏿‍🦼,👩‍🦼‍➡️,👩🏻‍🦼‍➡️,👩🏼‍🦼‍➡️,👩🏽‍🦼‍➡️,👩🏾‍🦼‍➡️,👩🏿‍🦼‍➡️,🧑‍🦽,🧑🏻‍🦽,🧑🏼‍🦽,🧑🏽‍🦽,🧑🏾‍🦽,🧑🏿‍🦽,🧑‍🦽‍➡️,🧑🏻‍🦽‍➡️,🧑🏼‍🦽‍➡️,🧑🏽‍🦽‍➡️,🧑🏾‍🦽‍➡️,🧑🏿‍🦽‍➡️,👨‍🦽,👨🏻‍🦽,👨🏼‍🦽,👨🏽‍🦽,👨🏾‍🦽,👨🏿‍🦽,👨‍🦽‍➡️,👨🏻‍🦽‍➡️,👨🏼‍🦽‍➡️,👨🏽‍🦽‍➡️,👨🏾‍🦽‍➡️,👨🏿‍🦽‍➡️,👩‍🦽,👩🏻‍🦽,👩🏼‍🦽,👩🏽‍🦽,👩🏾‍🦽,👩🏿‍🦽,👩‍🦽‍➡️,👩🏻‍🦽‍➡️,👩🏼‍🦽‍➡️,👩🏽‍🦽‍➡️,👩🏾‍🦽‍➡️,👩🏿‍🦽‍➡️,🏃,🏃🏻,🏃🏼,🏃🏽,🏃🏾,🏃🏿,🏃‍♂️,🏃🏻‍♂️,🏃🏼‍♂️,🏃🏽‍♂️,🏃🏾‍♂️,🏃🏿‍♂️,🏃‍♀️,🏃🏻‍♀️,🏃🏼‍♀️,🏃🏽‍♀️,🏃🏾‍♀️,🏃🏿‍♀️,🏃‍➡️,🏃🏻‍➡️,🏃🏼‍➡️,🏃🏽‍➡️,🏃🏾‍➡️,🏃🏿‍➡️,🏃‍♀️‍➡️,🏃🏻‍♀️‍➡️,🏃🏼‍♀️‍➡️,🏃🏽‍♀️‍➡️,🏃🏾‍♀️‍➡️,🏃🏿‍♀️‍➡️,🏃‍♂️‍➡️,🏃🏻‍♂️‍➡️,🏃🏼‍♂️‍➡️,🏃🏽‍♂️‍➡️,🏃🏾‍♂️‍➡️,🏃🏿‍♂️‍➡️,💃,💃🏻,💃🏼,💃🏽,💃🏾,💃🏿,🕺,🕺🏻,🕺🏼,🕺🏽,🕺🏾,🕺🏿,🕴️,🕴🏻,🕴🏼,🕴🏽,🕴🏾,🕴🏿,👯,👯‍♂️,👯‍♀️,🧖,🧖🏻,🧖🏼,🧖🏽,🧖🏾,🧖🏿,🧖‍♂️,🧖🏻‍♂️,🧖🏼‍♂️,🧖🏽‍♂️,🧖🏾‍♂️,🧖🏿‍♂️,🧖‍♀️,🧖🏻‍♀️,🧖🏼‍♀️,🧖🏽‍♀️,🧖🏾‍♀️,🧖🏿‍♀️,🧗,🧗🏻,🧗🏼,🧗🏽,🧗🏾,🧗🏿,🧗‍♂️,🧗🏻‍♂️,🧗🏼‍♂️,🧗🏽‍♂️,🧗🏾‍♂️,🧗🏿‍♂️,🧗‍♀️,🧗🏻‍♀️,🧗🏼‍♀️,🧗🏽‍♀️,🧗🏾‍♀️,🧗🏿‍♀️',
        'person-sport':
            '🤺,🏇,🏇🏻,🏇🏼,🏇🏽,🏇🏾,🏇🏿,⛷️,🏂,🏂🏻,🏂🏼,🏂🏽,🏂🏾,🏂🏿,🏌️,🏌🏻,🏌🏼,🏌🏽,🏌🏾,🏌🏿,🏌️‍♂️,🏌🏻‍♂️,🏌🏼‍♂️,🏌🏽‍♂️,🏌🏾‍♂️,🏌🏿‍♂️,🏌️‍♀️,🏌🏻‍♀️,🏌🏼‍♀️,🏌🏽‍♀️,🏌🏾‍♀️,🏌🏿‍♀️,🏄,🏄🏻,🏄🏼,🏄🏽,🏄🏾,🏄🏿,🏄‍♂️,🏄🏻‍♂️,🏄🏼‍♂️,🏄🏽‍♂️,🏄🏾‍♂️,🏄🏿‍♂️,🏄‍♀️,🏄🏻‍♀️,🏄🏼‍♀️,🏄🏽‍♀️,🏄🏾‍♀️,🏄🏿‍♀️,🚣,🚣🏻,🚣🏼,🚣🏽,🚣🏾,🚣🏿,🚣‍♂️,🚣🏻‍♂️,🚣🏼‍♂️,🚣🏽‍♂️,🚣🏾‍♂️,🚣🏿‍♂️,🚣‍♀️,🚣🏻‍♀️,🚣🏼‍♀️,🚣🏽‍♀️,🚣🏾‍♀️,🚣🏿‍♀️,🏊,🏊🏻,🏊🏼,🏊🏽,🏊🏾,🏊🏿,🏊‍♂️,🏊🏻‍♂️,🏊🏼‍♂️,🏊🏽‍♂️,🏊🏾‍♂️,🏊🏿‍♂️,🏊‍♀️,🏊🏻‍♀️,🏊🏼‍♀️,🏊🏽‍♀️,🏊🏾‍♀️,🏊🏿‍♀️,⛹️,⛹🏻,⛹🏼,⛹🏽,⛹🏾,⛹🏿,⛹️‍♂️,⛹🏻‍♂️,⛹🏼‍♂️,⛹🏽‍♂️,⛹🏾‍♂️,⛹🏿‍♂️,⛹️‍♀️,⛹🏻‍♀️,⛹🏼‍♀️,⛹🏽‍♀️,⛹🏾‍♀️,⛹🏿‍♀️,🏋️,🏋🏻,🏋🏼,🏋🏽,🏋🏾,🏋🏿,🏋️‍♂️,🏋🏻‍♂️,🏋🏼‍♂️,🏋🏽‍♂️,🏋🏾‍♂️,🏋🏿‍♂️,🏋️‍♀️,🏋🏻‍♀️,🏋🏼‍♀️,🏋🏽‍♀️,🏋🏾‍♀️,🏋🏿‍♀️,🚴,🚴🏻,🚴🏼,🚴🏽,🚴🏾,🚴🏿,🚴‍♂️,🚴🏻‍♂️,🚴🏼‍♂️,🚴🏽‍♂️,🚴🏾‍♂️,🚴🏿‍♂️,🚴‍♀️,🚴🏻‍♀️,🚴🏼‍♀️,🚴🏽‍♀️,🚴🏾‍♀️,🚴🏿‍♀️,🚵,🚵🏻,🚵🏼,🚵🏽,🚵🏾,🚵🏿,🚵‍♂️,🚵🏻‍♂️,🚵🏼‍♂️,🚵🏽‍♂️,🚵🏾‍♂️,🚵🏿‍♂️,🚵‍♀️,🚵🏻‍♀️,🚵🏼‍♀️,🚵🏽‍♀️,🚵🏾‍♀️,🚵🏿‍♀️,🤸,🤸🏻,🤸🏼,🤸🏽,🤸🏾,🤸🏿,🤸‍♂️,🤸🏻‍♂️,🤸🏼‍♂️,🤸🏽‍♂️,🤸🏾‍♂️,🤸🏿‍♂️,🤸‍♀️,🤸🏻‍♀️,🤸🏼‍♀️,🤸🏽‍♀️,🤸🏾‍♀️,🤸🏿‍♀️,🤼,🤼‍♂️,🤼‍♀️,🤽,🤽🏻,🤽🏼,🤽🏽,🤽🏾,🤽🏿,🤽‍♂️,🤽🏻‍♂️,🤽🏼‍♂️,🤽🏽‍♂️,🤽🏾‍♂️,🤽🏿‍♂️,🤽‍♀️,🤽🏻‍♀️,🤽🏼‍♀️,🤽🏽‍♀️,🤽🏾‍♀️,🤽🏿‍♀️,🤾,🤾🏻,🤾🏼,🤾🏽,🤾🏾,🤾🏿,🤾‍♂️,🤾🏻‍♂️,🤾🏼‍♂️,🤾🏽‍♂️,🤾🏾‍♂️,🤾🏿‍♂️,🤾‍♀️,🤾🏻‍♀️,🤾🏼‍♀️,🤾🏽‍♀️,🤾🏾‍♀️,🤾🏿‍♀️,🤹,🤹🏻,🤹🏼,🤹🏽,🤹🏾,🤹🏿,🤹‍♂️,🤹🏻‍♂️,🤹🏼‍♂️,🤹🏽‍♂️,🤹🏾‍♂️,🤹🏿‍♂️,🤹‍♀️,🤹🏻‍♀️,🤹🏼‍♀️,🤹🏽‍♀️,🤹🏾‍♀️,🤹🏿‍♀️',
        'person-resting': '🧘,🧘🏻,🧘🏼,🧘🏽,🧘🏾,🧘🏿,🧘‍♂️,🧘🏻‍♂️,🧘🏼‍♂️,🧘🏽‍♂️,🧘🏾‍♂️,🧘🏿‍♂️,🧘‍♀️,🧘🏻‍♀️,🧘🏼‍♀️,🧘🏽‍♀️,🧘🏾‍♀️,🧘🏿‍♀️,🛀,🛀🏻,🛀🏼,🛀🏽,🛀🏾,🛀🏿,🛌,🛌🏻,🛌🏼,🛌🏽,🛌🏾,🛌🏿',
        family: '🧑‍🤝‍🧑,🧑🏻‍🤝‍🧑🏻,🧑🏻‍🤝‍🧑🏼,🧑🏻‍🤝‍🧑🏽,🧑🏻‍🤝‍🧑🏾,🧑🏻‍🤝‍🧑🏿,🧑🏼‍🤝‍🧑🏻,🧑🏼‍🤝‍🧑🏼,🧑🏼‍🤝‍🧑🏽,🧑🏼‍🤝‍🧑🏾,🧑🏼‍🤝‍🧑🏿,🧑🏽‍🤝‍🧑🏻,🧑🏽‍🤝‍🧑🏼,🧑🏽‍🤝‍🧑🏽,🧑🏽‍🤝‍🧑🏾,🧑🏽‍🤝‍🧑🏿,🧑🏾‍🤝‍🧑🏻,🧑🏾‍🤝‍🧑🏼,🧑🏾‍🤝‍🧑🏽,🧑🏾‍🤝‍🧑🏾,🧑🏾‍🤝‍🧑🏿,🧑🏿‍🤝‍🧑🏻,🧑🏿‍🤝‍🧑🏼,🧑🏿‍🤝‍🧑🏽,🧑🏿‍🤝‍🧑🏾,🧑🏿‍🤝‍🧑🏿,👭,👭🏻,👩🏻‍🤝‍👩🏼,👩🏻‍🤝‍👩🏽,👩🏻‍🤝‍👩🏾,👩🏻‍🤝‍👩🏿,👩🏼‍🤝‍👩🏻,👭🏼,👩🏼‍🤝‍👩🏽,👩🏼‍🤝‍👩🏾,👩🏼‍🤝‍👩🏿,👩🏽‍🤝‍👩🏻,👩🏽‍🤝‍👩🏼,👭🏽,👩🏽‍🤝‍👩🏾,👩🏽‍🤝‍👩🏿,👩🏾‍🤝‍👩🏻,👩🏾‍🤝‍👩🏼,👩🏾‍🤝‍👩🏽,👭🏾,👩🏾‍🤝‍👩🏿,👩🏿‍🤝‍👩🏻,👩🏿‍🤝‍👩🏼,👩🏿‍🤝‍👩🏽,👩🏿‍🤝‍👩🏾,👭🏿,👫,👫🏻,👩🏻‍🤝‍👨🏼,👩🏻‍🤝‍👨🏽,👩🏻‍🤝‍👨🏾,👩🏻‍🤝‍👨🏿,👩🏼‍🤝‍👨🏻,👫🏼,👩🏼‍🤝‍👨🏽,👩🏼‍🤝‍👨🏾,👩🏼‍🤝‍👨🏿,👩🏽‍🤝‍👨🏻,👩🏽‍🤝‍👨🏼,👫🏽,👩🏽‍🤝‍👨🏾,👩🏽‍🤝‍👨🏿,👩🏾‍🤝‍👨🏻,👩🏾‍🤝‍👨🏼,👩🏾‍🤝‍👨🏽,👫🏾,👩🏾‍🤝‍👨🏿,👩🏿‍🤝‍👨🏻,👩🏿‍🤝‍👨🏼,👩🏿‍🤝‍👨🏽,👩🏿‍🤝‍👨🏾,👫🏿,👬,👬🏻,👨🏻‍🤝‍👨🏼,👨🏻‍🤝‍👨🏽,👨🏻‍🤝‍👨🏾,👨🏻‍🤝‍👨🏿,👨🏼‍🤝‍👨🏻,👬🏼,👨🏼‍🤝‍👨🏽,👨🏼‍🤝‍👨🏾,👨🏼‍🤝‍👨🏿,👨🏽‍🤝‍👨🏻,👨🏽‍🤝‍👨🏼,👬🏽,👨🏽‍🤝‍👨🏾,👨🏽‍🤝‍👨🏿,👨🏾‍🤝‍👨🏻,👨🏾‍🤝‍👨🏼,👨🏾‍🤝‍👨🏽,👬🏾,👨🏾‍🤝‍👨🏿,👨🏿‍🤝‍👨🏻,👨🏿‍🤝‍👨🏼,👨🏿‍🤝‍👨🏽,👨🏿‍🤝‍👨🏾,👬🏿,💏,💏🏻,💏🏼,💏🏽,💏🏾,💏🏿,🧑🏻‍❤️‍💋‍🧑🏼,🧑🏻‍❤️‍💋‍🧑🏽,🧑🏻‍❤️‍💋‍🧑🏾,🧑🏻‍❤️‍💋‍🧑🏿,🧑🏼‍❤️‍💋‍🧑🏻,🧑🏼‍❤️‍💋‍🧑🏽,🧑🏼‍❤️‍💋‍🧑🏾,🧑🏼‍❤️‍💋‍🧑🏿,🧑🏽‍❤️‍💋‍🧑🏻,🧑🏽‍❤️‍💋‍🧑🏼,🧑🏽‍❤️‍💋‍🧑🏾,🧑🏽‍❤️‍💋‍🧑🏿,🧑🏾‍❤️‍💋‍🧑🏻,🧑🏾‍❤️‍💋‍🧑🏼,🧑🏾‍❤️‍💋‍🧑🏽,🧑🏾‍❤️‍💋‍🧑🏿,🧑🏿‍❤️‍💋‍🧑🏻,🧑🏿‍❤️‍💋‍🧑🏼,🧑🏿‍❤️‍💋‍🧑🏽,🧑🏿‍❤️‍💋‍🧑🏾,👩‍❤️‍💋‍👨,👩🏻‍❤️‍💋‍👨🏻,👩🏻‍❤️‍💋‍👨🏼,👩🏻‍❤️‍💋‍👨🏽,👩🏻‍❤️‍💋‍👨🏾,👩🏻‍❤️‍💋‍👨🏿,👩🏼‍❤️‍💋‍👨🏻,👩🏼‍❤️‍💋‍👨🏼,👩🏼‍❤️‍💋‍👨🏽,👩🏼‍❤️‍💋‍👨🏾,👩🏼‍❤️‍💋‍👨🏿,👩🏽‍❤️‍💋‍👨🏻,👩🏽‍❤️‍💋‍👨🏼,👩🏽‍❤️‍💋‍👨🏽,👩🏽‍❤️‍💋‍👨🏾,👩🏽‍❤️‍💋‍👨🏿,👩🏾‍❤️‍💋‍👨🏻,👩🏾‍❤️‍💋‍👨🏼,👩🏾‍❤️‍💋‍👨🏽,👩🏾‍❤️‍💋‍👨🏾,👩🏾‍❤️‍💋‍👨🏿,👩🏿‍❤️‍💋‍👨🏻,👩🏿‍❤️‍💋‍👨🏼,👩🏿‍❤️‍💋‍👨🏽,👩🏿‍❤️‍💋‍👨🏾,👩🏿‍❤️‍💋‍👨🏿,👨‍❤️‍💋‍👨,👨🏻‍❤️‍💋‍👨🏻,👨🏻‍❤️‍💋‍👨🏼,👨🏻‍❤️‍💋‍👨🏽,👨🏻‍❤️‍💋‍👨🏾,👨🏻‍❤️‍💋‍👨🏿,👨🏼‍❤️‍💋‍👨🏻,👨🏼‍❤️‍💋‍👨🏼,👨🏼‍❤️‍💋‍👨🏽,👨🏼‍❤️‍💋‍👨🏾,👨🏼‍❤️‍💋‍👨🏿,👨🏽‍❤️‍💋‍👨🏻,👨🏽‍❤️‍💋‍👨🏼,👨🏽‍❤️‍💋‍👨🏽,👨🏽‍❤️‍💋‍👨🏾,👨🏽‍❤️‍💋‍👨🏿,👨🏾‍❤️‍💋‍👨🏻,👨🏾‍❤️‍💋‍👨🏼,👨🏾‍❤️‍💋‍👨🏽,👨🏾‍❤️‍💋‍👨🏾,👨🏾‍❤️‍💋‍👨🏿,👨🏿‍❤️‍💋‍👨🏻,👨🏿‍❤️‍💋‍👨🏼,👨🏿‍❤️‍💋‍👨🏽,👨🏿‍❤️‍💋‍👨🏾,👨🏿‍❤️‍💋‍👨🏿,👩‍❤️‍💋‍👩,👩🏻‍❤️‍💋‍👩🏻,👩🏻‍❤️‍💋‍👩🏼,👩🏻‍❤️‍💋‍👩🏽,👩🏻‍❤️‍💋‍👩🏾,👩🏻‍❤️‍💋‍👩🏿,👩🏼‍❤️‍💋‍👩🏻,👩🏼‍❤️‍💋‍👩🏼,👩🏼‍❤️‍💋‍👩🏽,👩🏼‍❤️‍💋‍👩🏾,👩🏼‍❤️‍💋‍👩🏿,👩🏽‍❤️‍💋‍👩🏻,👩🏽‍❤️‍💋‍👩🏼,👩🏽‍❤️‍💋‍👩🏽,👩🏽‍❤️‍💋‍👩🏾,👩🏽‍❤️‍💋‍👩🏿,👩🏾‍❤️‍💋‍👩🏻,👩🏾‍❤️‍💋‍👩🏼,👩🏾‍❤️‍💋‍👩🏽,👩🏾‍❤️‍💋‍👩🏾,👩🏾‍❤️‍💋‍👩🏿,👩🏿‍❤️‍💋‍👩🏻,👩🏿‍❤️‍💋‍👩🏼,👩🏿‍❤️‍💋‍👩🏽,👩🏿‍❤️‍💋‍👩🏾,👩🏿‍❤️‍💋‍👩🏿,💑,💑🏻,💑🏼,💑🏽,💑🏾,💑🏿,🧑🏻‍❤️‍🧑🏼,🧑🏻‍❤️‍🧑🏽,🧑🏻‍❤️‍🧑🏾,🧑🏻‍❤️‍🧑🏿,🧑🏼‍❤️‍🧑🏻,🧑🏼‍❤️‍🧑🏽,🧑🏼‍❤️‍🧑🏾,🧑🏼‍❤️‍🧑🏿,🧑🏽‍❤️‍🧑🏻,🧑🏽‍❤️‍🧑🏼,🧑🏽‍❤️‍🧑🏾,🧑🏽‍❤️‍🧑🏿,🧑🏾‍❤️‍🧑🏻,🧑🏾‍❤️‍🧑🏼,🧑🏾‍❤️‍🧑🏽,🧑🏾‍❤️‍🧑🏿,🧑🏿‍❤️‍🧑🏻,🧑🏿‍❤️‍🧑🏼,🧑🏿‍❤️‍🧑🏽,🧑🏿‍❤️‍🧑🏾,👩‍❤️‍👨,👩🏻‍❤️‍👨🏻,👩🏻‍❤️‍👨🏼,👩🏻‍❤️‍👨🏽,👩🏻‍❤️‍👨🏾,👩🏻‍❤️‍👨🏿,👩🏼‍❤️‍👨🏻,👩🏼‍❤️‍👨🏼,👩🏼‍❤️‍👨🏽,👩🏼‍❤️‍👨🏾,👩🏼‍❤️‍👨🏿,👩🏽‍❤️‍👨🏻,👩🏽‍❤️‍👨🏼,👩🏽‍❤️‍👨🏽,👩🏽‍❤️‍👨🏾,👩🏽‍❤️‍👨🏿,👩🏾‍❤️‍👨🏻,👩🏾‍❤️‍👨🏼,👩🏾‍❤️‍👨🏽,👩🏾‍❤️‍👨🏾,👩🏾‍❤️‍👨🏿,👩🏿‍❤️‍👨🏻,👩🏿‍❤️‍👨🏼,👩🏿‍❤️‍👨🏽,👩🏿‍❤️‍👨🏾,👩🏿‍❤️‍👨🏿,👨‍❤️‍👨,👨🏻‍❤️‍👨🏻,👨🏻‍❤️‍👨🏼,👨🏻‍❤️‍👨🏽,👨🏻‍❤️‍👨🏾,👨🏻‍❤️‍👨🏿,👨🏼‍❤️‍👨🏻,👨🏼‍❤️‍👨🏼,👨🏼‍❤️‍👨🏽,👨🏼‍❤️‍👨🏾,👨🏼‍❤️‍👨🏿,👨🏽‍❤️‍👨🏻,👨🏽‍❤️‍👨🏼,👨🏽‍❤️‍👨🏽,👨🏽‍❤️‍👨🏾,👨🏽‍❤️‍👨🏿,👨🏾‍❤️‍👨🏻,👨🏾‍❤️‍👨🏼,👨🏾‍❤️‍👨🏽,👨🏾‍❤️‍👨🏾,👨🏾‍❤️‍👨🏿,👨🏿‍❤️‍👨🏻,👨🏿‍❤️‍👨🏼,👨🏿‍❤️‍👨🏽,👨🏿‍❤️‍👨🏾,👨🏿‍❤️‍👨🏿,👩‍❤️‍👩,👩🏻‍❤️‍👩🏻,👩🏻‍❤️‍👩🏼,👩🏻‍❤️‍👩🏽,👩🏻‍❤️‍👩🏾,👩🏻‍❤️‍👩🏿,👩🏼‍❤️‍👩🏻,👩🏼‍❤️‍👩🏼,👩🏼‍❤️‍👩🏽,👩🏼‍❤️‍👩🏾,👩🏼‍❤️‍👩🏿,👩🏽‍❤️‍👩🏻,👩🏽‍❤️‍👩🏼,👩🏽‍❤️‍👩🏽,👩🏽‍❤️‍👩🏾,👩🏽‍❤️‍👩🏿,👩🏾‍❤️‍👩🏻,👩🏾‍❤️‍👩🏼,👩🏾‍❤️‍👩🏽,👩🏾‍❤️‍👩🏾,👩🏾‍❤️‍👩🏿,👩🏿‍❤️‍👩🏻,👩🏿‍❤️‍👩🏼,👩🏿‍❤️‍👩🏽,👩🏿‍❤️‍👩🏾,👩🏿‍❤️‍👩🏿,👨‍👩‍👦,👨‍👩‍👧,👨‍👩‍👧‍👦,👨‍👩‍👦‍👦,👨‍👩‍👧‍👧,👨‍👨‍👦,👨‍👨‍👧,👨‍👨‍👧‍👦,👨‍👨‍👦‍👦,👨‍👨‍👧‍👧,👩‍👩‍👦,👩‍👩‍👧,👩‍👩‍👧‍👦,👩‍👩‍👦‍👦,👩‍👩‍👧‍👧,👨‍👦,👨‍👦‍👦,👨‍👧,👨‍👧‍👦,👨‍👧‍👧,👩‍👦,👩‍👦‍👦,👩‍👧,👩‍👧‍👦,👩‍👧‍👧',
        'person-symbol': '🗣️,👤,👥,🫂,👪,🧑‍🧑‍🧒,🧑‍🧑‍🧒‍🧒,🧑‍🧒,🧑‍🧒‍🧒,👣',
    },

    Component: { 'skin-tone': '🏻,🏼,🏽,🏾,🏿', 'hair-style': '🦰,🦱,🦳,🦲' },

    'Animals & Nature': {
        'animal-mammal':
            '🐵,🐒,🦍,🦧,🐶,🐕,🦮,🐕‍🦺,🐩,🐺,🦊,🦝,🐱,🐈,🐈‍⬛,🦁,🐯,🐅,🐆,🐴,🫎,🫏,🐎,🦄,🦓,🦌,🦬,🐮,🐂,🐃,🐄,🐷,🐖,🐗,🐽,🐏,🐑,🐐,🐪,🐫,🦙,🦒,🐘,🦣,🦏,🦛,🐭,🐁,🐀,🐹,🐰,🐇,🐿️,🦫,🦔,🦇,🐻,🐻‍❄️,🐨,🐼,🦥,🦦,🦨,🦘,🦡,🐾',
        'animal-bird': '🦃,🐔,🐓,🐣,🐤,🐥,🐦,🐧,🕊️,🦅,🦆,🦢,🦉,🦤,🪶,🦩,🦚,🦜,🪽,🐦‍⬛,🪿,🐦‍🔥',
        'animal-amphibian': '🐸',
        'animal-reptile': '🐊,🐢,🦎,🐍,🐲,🐉,🦕,🦖',
        'animal-marine': '🐳,🐋,🐬,🦭,🐟,🐠,🐡,🦈,🐙,🐚,🪸,🪼',
        'animal-bug': '🐌,🦋,🐛,🐜,🐝,🪲,🐞,🦗,🪳,🕷️,🕸️,🦂,🦟,🪰,🪱,🦠',
        'plant-flower': '💐,🌸,💮,🪷,🏵️,🌹,🥀,🌺,🌻,🌼,🌷,🪻',
        'plant-other': '🌱,🪴,🌲,🌳,🌴,🌵,🌾,🌿,☘️,🍀,🍁,🍂,🍃,🪹,🪺,🍄',
    },

    'Food & Drink': {
        'food-fruit': '🍇,🍈,🍉,🍊,🍋,🍋‍🟩,🍌,🍍,🥭,🍎,🍏,🍐,🍑,🍒,🍓,🫐,🥝,🍅,🫒,🥥',
        'food-vegetable': '🥑,🍆,🥔,🥕,🌽,🌶️,🫑,🥒,🥬,🥦,🧄,🧅,🥜,🫘,🌰,🫚,🫛,🍄‍🟫',
        'food-prepared':
            '🍞,🥐,🥖,🫓,🥨,🥯,🥞,🧇,🧀,🍖,🍗,🥩,🥓,🍔,🍟,🍕,🌭,🥪,🌮,🌯,🫔,🥙,🧆,🥚,🍳,🥘,🍲,🫕,🥣,🥗,🍿,🧈,🧂,🥫',
        'food-asian': '🍱,🍘,🍙,🍚,🍛,🍜,🍝,🍠,🍢,🍣,🍤,🍥,🥮,🍡,🥟,🥠,🥡',
        'food-marine': '🦀,🦞,🦐,🦑,🦪',
        'food-sweet': '🍦,🍧,🍨,🍩,🍪,🎂,🍰,🧁,🥧,🍫,🍬,🍭,🍮,🍯',
        drink: '🍼,🥛,☕,🫖,🍵,🍶,🍾,🍷,🍸,🍹,🍺,🍻,🥂,🥃,🫗,🥤,🧋,🧃,🧉,🧊',
        dishware: '🥢,🍽️,🍴,🥄,🔪,🫙,🏺',
    },

    'Travel & Places': {
        'place-map': '🌍,🌎,🌏,🌐,🗺️,🗾,🧭',
        'place-geographic': '🏔️,⛰️,🌋,🗻,🏕️,🏖️,🏜️,🏝️,🏞️',
        'place-building': '🏟️,🏛️,🏗️,🧱,🪨,🪵,🛖,🏘️,🏚️,🏠,🏡,🏢,🏣,🏤,🏥,🏦,🏨,🏩,🏪,🏫,🏬,🏭,🏯,🏰,💒,🗼,🗽',
        'place-religious': '⛪,🕌,🛕,🕍,⛩️,🕋',
        'place-other': '⛲,⛺,🌁,🌃,🏙️,🌄,🌅,🌆,🌇,🌉,♨️,🎠,🛝,🎡,🎢,💈,🎪',
        'transport-ground':
            '🚂,🚃,🚄,🚅,🚆,🚇,🚈,🚉,🚊,🚝,🚞,🚋,🚌,🚍,🚎,🚐,🚑,🚒,🚓,🚔,🚕,🚖,🚗,🚘,🚙,🛻,🚚,🚛,🚜,🏎️,🏍️,🛵,🦽,🦼,🛺,🚲,🛴,🛹,🛼,🚏,🛣️,🛤️,🛢️,⛽,🛞,🚨,🚥,🚦,🛑,🚧',
        'transport-water': '⚓,🛟,⛵,🛶,🚤,🛳️,⛴️,🛥️,🚢',
        'transport-air': '✈️,🛩️,🛫,🛬,🪂,💺,🚁,🚟,🚠,🚡,🛰️,🚀,🛸',
        hotel: '🛎️,🧳',
        time: '⌛,⏳,⌚,⏰,⏱️,⏲️,🕰️,🕛,🕧,🕐,🕜,🕑,🕝,🕒,🕞,🕓,🕟,🕔,🕠,🕕,🕡,🕖,🕢,🕗,🕣,🕘,🕤,🕙,🕥,🕚,🕦',
        'sky & weather':
            '🌑,🌒,🌓,🌔,🌕,🌖,🌗,🌘,🌙,🌚,🌛,🌜,🌡️,☀️,🌝,🌞,🪐,⭐,🌟,🌠,🌌,☁️,⛅,⛈️,🌤️,🌥️,🌦️,🌧️,🌨️,🌩️,🌪️,🌫️,🌬️,🌀,🌈,🌂,☂️,☔,⛱️,⚡,❄️,☃️,⛄,☄️,🔥,💧,🌊',
    },

    Activities: {
        event: '🎃,🎄,🎆,🎇,🧨,✨,🎈,🎉,🎊,🎋,🎍,🎎,🎏,🎐,🎑,🧧,🎀,🎁,🎗️,🎟️,🎫',
        'award-medal': '🎖️,🏆,🏅,🥇,🥈,🥉',
        sport: '⚽,⚾,🥎,🏀,🏐,🏈,🏉,🎾,🥏,🎳,🏏,🏑,🏒,🥍,🏓,🏸,🥊,🥋,🥅,⛳,⛸️,🎣,🤿,🎽,🎿,🛷,🥌',
        game: '🎯,🪀,🪁,🔫,🎱,🔮,🪄,🎮,🕹️,🎰,🎲,🧩,🧸,🪅,🪩,🪆,♠️,♥️,♦️,♣️,♟️,🃏,🀄,🎴',
        'arts & crafts': '🎭,🖼️,🎨,🧵,🪡,🧶,🪢',
    },

    Objects: {
        clothing:
            '👓,🕶️,🥽,🥼,🦺,👔,👕,👖,🧣,🧤,🧥,🧦,👗,👘,🥻,🩱,🩲,🩳,👙,👚,🪭,👛,👜,👝,🛍️,🎒,🩴,👞,👟,🥾,🥿,👠,👡,🩰,👢,🪮,👑,👒,🎩,🎓,🧢,🪖,⛑️,📿,💄,💍,💎',
        sound: '🔇,🔈,🔉,🔊,📢,📣,📯,🔔,🔕',
        music: '🎼,🎵,🎶,🎙️,🎚️,🎛️,🎤,🎧,📻',
        'musical-instrument': '🎷,🪗,🎸,🎹,🎺,🎻,🪕,🥁,🪘,🪇,🪈',
        phone: '📱,📲,☎️,📞,📟,📠',
        computer: '🔋,🪫,🔌,💻,🖥️,🖨️,⌨️,🖱️,🖲️,💽,💾,💿,📀,🧮',
        'light & video': '🎥,🎞️,📽️,🎬,📺,📷,📸,📹,📼,🔍,🔎,🕯️,💡,🔦,🏮,🪔',
        'book-paper': '📔,📕,📖,📗,📘,📙,📚,📓,📒,📃,📜,📄,📰,🗞️,📑,🔖,🏷️',
        money: '💰,🪙,💴,💵,💶,💷,💸,💳,🧾,💹',
        mail: '✉️,📧,📨,📩,📤,📥,📦,📫,📪,📬,📭,📮,🗳️',
        writing: '✏️,✒️,🖋️,🖊️,🖌️,🖍️,📝',
        office: '💼,📁,📂,🗂️,📅,📆,🗒️,🗓️,📇,📈,📉,📊,📋,📌,📍,📎,🖇️,📏,📐,✂️,🗃️,🗄️,🗑️',
        lock: '🔒,🔓,🔏,🔐,🔑,🗝️',
        tool: '🔨,🪓,⛏️,⚒️,🛠️,🗡️,⚔️,💣,🪃,🏹,🛡️,🪚,🔧,🪛,🔩,⚙️,🗜️,⚖️,🦯,🔗,⛓️‍💥,⛓️,🪝,🧰,🧲,🪜',
        science: '⚗️,🧪,🧫,🧬,🔬,🔭,📡',
        medical: '💉,🩸,💊,🩹,🩼,🩺,🩻',
        household: '🚪,🛗,🪞,🪟,🛏️,🛋️,🪑,🚽,🪠,🚿,🛁,🪤,🪒,🧴,🧷,🧹,🧺,🧻,🪣,🧼,🫧,🪥,🧽,🧯,🛒',
        'other-object': '🚬,⚰️,🪦,⚱️,🧿,🪬,🗿,🪧,🪪',
    },

    Symbols: {
        'transport-sign': '🏧,🚮,🚰,♿,🚹,🚺,🚻,🚼,🚾,🛂,🛃,🛄,🛅',
        warning: '⚠️,🚸,⛔,🚫,🚳,🚭,🚯,🚱,🚷,📵,🔞,☢️,☣️',
        arrow: '⬆️,↗️,➡️,↘️,⬇️,↙️,⬅️,↖️,↕️,↔️,↩️,↪️,⤴️,⤵️,🔃,🔄,🔙,🔚,🔛,🔜,🔝',
        religion: '🛐,⚛️,🕉️,✡️,☸️,☯️,✝️,☦️,☪️,☮️,🕎,🔯,🪯',
        zodiac: '♈,♉,♊,♋,♌,♍,♎,♏,♐,♑,♒,♓,⛎',
        'av-symbol': '🔀,🔁,🔂,▶️,⏩,⏭️,⏯️,◀️,⏪,⏮️,🔼,⏫,🔽,⏬,⏸️,⏹️,⏺️,⏏️,🎦,🔅,🔆,📶,🛜,📳,📴',
        gender: '♀️,♂️,⚧️',
        math: '✖️,➕,➖,➗,🟰,♾️',
        punctuation: '‼️,⁉️,❓,❔,❕,❗,〰️',
        currency: '💱,💲',
        'other-symbol': '⚕️,♻️,⚜️,🔱,📛,🔰,⭕,✅,☑️,✔️,❌,❎,➰,➿,〽️,✳️,✴️,❇️,©️,®️,™️',
        keycap: '#️⃣,*️⃣,0️⃣,1️⃣,2️⃣,3️⃣,4️⃣,5️⃣,6️⃣,7️⃣,8️⃣,9️⃣,🔟',
        alphanum:
            '🔠,🔡,🔢,🔣,🔤,🅰️,🆎,🅱️,🆑,🆒,🆓,ℹ️,🆔,Ⓜ️,🆕,🆖,🅾️,🆗,🅿️,🆘,🆙,🆚,🈁,🈂️,🈷️,🈶,🈯,🉐,🈹,🈚,🈲,🉑,🈸,🈴,🈳,㊗️,㊙️,🈺,🈵',
        geometric:
            '🔴,🟠,🟡,🟢,🔵,🟣,🟤,⚫,⚪,🟥,🟧,🟨,🟩,🟦,🟪,🟫,⬛,⬜,◼️,◻️,◾,◽,▪️,▫️,🔶,🔷,🔸,🔹,🔺,🔻,💠,🔘,🔳,🔲',
    },

    Flags: {
        flag: '🏁,🚩,🎌,🏴,🏳️,🏳️‍🌈,🏳️‍⚧️,🏴‍☠️',
        'country-flag':
            '🇦🇨,🇦🇩,🇦🇪,🇦🇫,🇦🇬,🇦🇮,🇦🇱,🇦🇲,🇦🇴,🇦🇶,🇦🇷,🇦🇸,🇦🇹,🇦🇺,🇦🇼,🇦🇽,🇦🇿,🇧🇦,🇧🇧,🇧🇩,🇧🇪,🇧🇫,🇧🇬,🇧🇭,🇧🇮,🇧🇯,🇧🇱,🇧🇲,🇧🇳,🇧🇴,🇧🇶,🇧🇷,🇧🇸,🇧🇹,🇧🇻,🇧🇼,🇧🇾,🇧🇿,🇨🇦,🇨🇨,🇨🇩,🇨🇫,🇨🇬,🇨🇭,🇨🇮,🇨🇰,🇨🇱,🇨🇲,🇨🇳,🇨🇴,🇨🇵,🇨🇷,🇨🇺,🇨🇻,🇨🇼,🇨🇽,🇨🇾,🇨🇿,🇩🇪,🇩🇬,🇩🇯,🇩🇰,🇩🇲,🇩🇴,🇩🇿,🇪🇦,🇪🇨,🇪🇪,🇪🇬,🇪🇭,🇪🇷,🇪🇸,🇪🇹,🇪🇺,🇫🇮,🇫🇯,🇫🇰,🇫🇲,🇫🇴,🇫🇷,🇬🇦,🇬🇧,🇬🇩,🇬🇪,🇬🇫,🇬🇬,🇬🇭,🇬🇮,🇬🇱,🇬🇲,🇬🇳,🇬🇵,🇬🇶,🇬🇷,🇬🇸,🇬🇹,🇬🇺,🇬🇼,🇬🇾,🇭🇰,🇭🇲,🇭🇳,🇭🇷,🇭🇹,🇭🇺,🇮🇨,🇮🇩,🇮🇪,🇮🇱,🇮🇲,🇮🇳,🇮🇴,🇮🇶,🇮🇷,🇮🇸,🇮🇹,🇯🇪,🇯🇲,🇯🇴,🇯🇵,🇰🇪,🇰🇬,🇰🇭,🇰🇮,🇰🇲,🇰🇳,🇰🇵,🇰🇷,🇰🇼,🇰🇾,🇰🇿,🇱🇦,🇱🇧,🇱🇨,🇱🇮,🇱🇰,🇱🇷,🇱🇸,🇱🇹,🇱🇺,🇱🇻,🇱🇾,🇲🇦,🇲🇨,🇲🇩,🇲🇪,🇲🇫,🇲🇬,🇲🇭,🇲🇰,🇲🇱,🇲🇲,🇲🇳,🇲🇴,🇲🇵,🇲🇶,🇲🇷,🇲🇸,🇲🇹,🇲🇺,🇲🇻,🇲🇼,🇲🇽,🇲🇾,🇲🇿,🇳🇦,🇳🇨,🇳🇪,🇳🇫,🇳🇬,🇳🇮,🇳🇱,🇳🇴,🇳🇵,🇳🇷,🇳🇺,🇳🇿,🇴🇲,🇵🇦,🇵🇪,🇵🇫,🇵🇬,🇵🇭,🇵🇰,🇵🇱,🇵🇲,🇵🇳,🇵🇷,🇵🇸,🇵🇹,🇵🇼,🇵🇾,🇶🇦,🇷🇪,🇷🇴,🇷🇸,🇷🇺,🇷🇼,🇸🇦,🇸🇧,🇸🇨,🇸🇩,🇸🇪,🇸🇬,🇸🇭,🇸🇮,🇸🇯,🇸🇰,🇸🇱,🇸🇲,🇸🇳,🇸🇴,🇸🇷,🇸🇸,🇸🇹,🇸🇻,🇸🇽,🇸🇾,🇸🇿,🇹🇦,🇹🇨,🇹🇩,🇹🇫,🇹🇬,🇹🇭,🇹🇯,🇹🇰,🇹🇱,🇹🇲,🇹🇳,🇹🇴,🇹🇷,🇹🇹,🇹🇻,🇹🇼,🇹🇿,🇺🇦,🇺🇬,🇺🇲,🇺🇳,🇺🇸,🇺🇾,🇺🇿,🇻🇦,🇻🇨,🇻🇪,🇻🇬,🇻🇮,🇻🇳,🇻🇺,🇼🇫,🇼🇸,🇽🇰,🇾🇪,🇾🇹,🇿🇦,🇿🇲,🇿🇼',
        'subdivision-flag': '🏴󠁧󠁢󠁥󠁮󠁧󠁿,🏴󠁧󠁢󠁳󠁣󠁴󠁿,🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    },
};

export const emojis = Object.entries(emojiList)
    .filter(e => e[0] !== 'Component')
    .map(e => ({
        label: e[0],
        options: Object.values(e[1]).join(',').split(','),
    }));
