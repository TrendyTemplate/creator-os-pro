import React from "react";
export default class ErrorBoundary extends React.Component{
  constructor(props){super(props);this.state={hasError:false,error:null}}
  static getDerivedStateFromError(error){return{hasError:true,error}}
  componentDidCatch(error,info){console.error(error,info)}
  render(){
    if(this.state.hasError){
      return <div className="error-screen"><h1>Something went wrong</h1><p>Refresh করুন বা last deploy rollback করুন।</p><pre>{String(this.state.error?.message||this.state.error)}</pre><button className="primary" onClick={()=>location.reload()}>Reload</button></div>
    }
    return this.props.children;
  }
}
