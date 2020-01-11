import { createStyles } from '@material-ui/core/styles';

const styles = () => createStyles({
    predictiveSearchArea: {
        position: "relative",
        flex: 1},
    search: {
        width: "100%",
        textAlign: "right",
        position: "relative",
        border: "1px solid #d9dadb",
    },
    searchBox: {
        border: "4px solid transparent",
        borderRadius: "2px",
        fontSize: "1rem",
        width: "100%",
        padding: "0.525rem",
        paddingRight: "40px"
    },
    searchBtn: {
        height: "100%",
        width: "2em",
        marginTop: "-1em",
        position: "absolute",
        top: "50%",
        right: "0.5rem",
        opacity: 0.2,
        backgroundColor: "transparent",
        border: 0,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
        backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAACnElEQVR4AcXZsUsbYRjH8e+dh2s1SyAGJwMJuDj1BIcEhJQIOnTq5F+QOf0jIq79A7oFh7aYyVBEkaZDC3awECc1AUXRIqUQotfFocnjJe/dk+b9PKP65Md7z13ee3Uwk2SNHKmngs5TnbDLJQqjA+RYZ4OXuDzvkSYf+cAJ44fPAYFhHeAzVhlqBBGrRoax8KjSJYhRXap4KCVoECiqQQKFLC0CZbXIElOBOwJ9cUchzm2Y5QsveN4tdfY4o00HSDHHPKuUmOV5v/D5SSSJ0MXfIY+HBB55dkIvRIIIvJDR28dnFJ/9kHH0MFaVDehRxlSZnuxAFUMZunKQKBJFUQ4wXTIYqcmPZ5GoFmUEahjw5eJTJI6ivBD4jCS/csrEVZZfU4yQk5OPhrwjcoRygQ0GVdCQf73OUEfisaMkHk1HDJHkYeDX82jlBzo+kCSEyxruwDP/EK1DbsWnhHDFgNTpodWjLgY9NECKfnvoyS4p8wBngN5Z/ABtQK8dP0AH0OuYB5iMqfAAMque7HJtHmAOPdnlxjzAPHqyy5V5gFX0ZJfj8AAn9CvhoeVRol8zPMAuj/xrlhW0Vpg1D3ApflhGR3b4wTlDvI24i4u+w9y0uyVrM213U1qxuy2/Z8bui8m23VezgGW7L6cBLdIWXs9FBAsHFCLCJI9opFMKXEzkkEp/IbK0bEdI0LARQRzVWoigPKy+Z5tlWooIiuP6NhVmAEiPNwLkqHDEw5CGx2wyDQDRI8T7l80U19xwxTFNmpwzKM1nFsyeCw7jFymCAxYjrHDp8r9cUOCUYRZ4Bw6AxVV47QJYXIVXLliNsOSC1Qh/XLAa4ZuDmmIcH1l2AaytwhZfmaAkn/qOb7eYBofJekOJJX7znfccAvwFyB3OeNys7d4AAAAASUVORK5CYII=")',
    },
    options: {
        display: "block",
        listStyle: "none",
        width: "100%",
        margin: "auto",
        position: "absolute",
        backgroundColor: "white",
        zIndex: 9999,
        maxHeight: "430px",
        overflowY: "auto",
        padding: "0px",
        boxShadow:"0px 10px 10px rgba(0,0,0,.1)",
        "& li":{
            display: "block",
            background: "white",
            margin: "10px auto",
            padding: "10px",
            fontSize: "1.2rem",
            width: "100%",
            borderRadius: "2px",
            textAlign:"left",
            "&:hover":{
                fontWeight: "bold",
                color: "#00b4cc",
                cursor: "pointer",
            }
        },
    },
    optionActive:{
        background: "whitesmoke",
        fontSize: "1.5rem",
        color: "#00b4cc"
    }
    });
export default styles;