import React from 'react';
import classNames from 'classnames';
import ReactMarkdown from 'react-markdown'
function Message({ message ,isLoading=false}) {
  return (
    <div
      className={classNames(
        message.From === 'Eepow' ? 'justify-start' : 'justify-end',
        'flex flex-row items-center my-2'
      )}
    >
      {message.From === 'Eepow' ?
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-dark flex-shrink-0">
         {message.From.charAt(0)}
      </div> : null}
      <div className="relative ml-3 text-sm bg-beige py-2 px-4 shadow rounded-xl">
        {isLoading? (
        <div >  
            <div className="bg-darker inline-block animate-pulse rounded-full h-2.5 w-2.5 border-t-2 border-primary border-solid mr-2"></div>
            <div className="bg-darker inline-block animate-pulse rounded-full h-2.5 w-2.5 border-t-2 border-primary border-solid mr-2"></div>
            <div className="bg-darker inline-block animate-pulse rounded-full h-2.5 w-2.5 border-t-2 border-primary border-solid"></div>
      </div>
      ):(
      <ReactMarkdown>{String(message.Data)}</ReactMarkdown>
      )}
      </div>
    </div>
  );
}

export default Message;
