import React, { Component, createRef } from 'react'

import { setHeightScrollHorizontal, setHeightScrollVertical, animateFrame } from '../helpers/utils'

export default class Scrollpage extends Component {
    constructor(props) {
        super(props);

        this.piContainer = createRef();
        this.fixcontainer = createRef();

        this.funcResize = null;
        this.funcScroll = null;

        this.scrollTop = 0;
        this.tweened = 0;
        this.req = null;
        this.speed = this.props.speed ?? 0.09;

        this.isHorizontalScroll = this.props.isHorizontalScroll ?? true;
    }

    componentDidMount() {
        animateFrame();
        let speed = this.speed;

        //set the styles
        this.fixcontainer.current.style.position = 'fixed';
        this.fixcontainer.current.style.top = '0';
        this.fixcontainer.current.style.left = '0';
        this.fixcontainer.current.style.transform = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)';

        const scrollDefault = () => {
            this.scrollTop = window.scrollY;
        };

        function lerp(a, b, n) {
        return (1 - n) * a + n * b;
        }

        const update = (currentTime) => {
            this.req = window.requestAnimationFrame(update);
            if (Math.abs(this.scrollTop - this.tweened) > 0) {
                // const left =  Math.floor(this.tweened += speed * (this.scrollTop - this.tweened));
                this.tweened = lerp(this.tweened, this.scrollTop, speed);
                const left = this.tweened = Math.floor(this.tweened*100)/100;

                if (window.innerWidth > 1025 && this.isHorizontalScroll) {
                    this.fixcontainer.current.style.transform = `matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, ${(left * -1)},0,0,1)`;
                    setHeightScrollHorizontal(this.fixcontainer.current, this.piContainer.current);
                } else {
                    this.fixcontainer.current.style.transform = `matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,${(left * -1)},0,1)`;
                    setHeightScrollVertical(this.fixcontainer.current, this.piContainer.current);
                }
            }
        }
        update();

        const callbackScroll = (scroll) => this.scrollTop = scroll;

        this.funcResize  = () => {
            this.req = null;

            if (window.innerWidth > 1025 && this.isHorizontalScroll) {
                this.fixcontainer.current.style.display = 'flex';
                this.fixcontainer.current.style.height = '100vh';
                setHeightScrollHorizontal(this.fixcontainer.current, this.piContainer.current);
                if (this.funcScroll) {
                    window.removeEventListener('scroll', this.funcScroll);
                    this.funcScroll = null;
                }
                if (this.props.scrollHandle) {
                    this.funcScroll = this.props.scrollHandle.bind(this, callbackScroll);
                } else {
                    this.funcScroll = scrollDefault;
                }

                window.addEventListener('mousemove', this.funcMouseMove);
            } else {
                this.fixcontainer.current.style.display = 'block';
                this.fixcontainer.current.style.height = 'initial';
                setHeightScrollVertical(this.fixcontainer.current, this.piContainer.current);
                if (this.funcScroll) {
                    window.removeEventListener('scroll', this.funcScroll);
                    this.funcScroll = null;
                }
                this.funcScroll = scrollDefault;
            }

            if (this.isHorizontalScroll) {
                speed = window.innerWidth > 1025 ? this.speed : 1;
            }
            if (!this.isHorizontalScroll) {
                speed = window.innerWidth > 1025 ? this.speed : 1;
            }

            window.addEventListener('scroll',  this.funcScroll, false);
        };
        window.addEventListener('resize', this.funcResize, false);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.funcScroll);
        window.removeEventListener('resize', this.funcResize);
        window.cancelAnimationFrame(this.req);
    }

    render() {
        return (
            <>
                <div ref={this.fixcontainer}>
                    {this.props.children}
                </div>
                <div ref={this.piContainer}></div>
            </>
        )
    }
}
