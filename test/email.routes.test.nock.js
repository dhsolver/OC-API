import nock from 'nock';

export default function() {
  nock('http://127.0.0.1:62354')
    .post('/webhooks/mailgun', {
      recipient: 'info@testcollective.opencollective.com',
      domain: 'opencollective.com',
      From: 'Xavier Damman <xdamman+test@gmail.com>',
      'X-Envelope-From': '<xdamman+test@gmail.com>',
      'X-Google-Dkim-Signature':
        'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=1e100.net; s=20130820;        h=x-gm-message-state:mime-version:reply-to:from:date:message-id         :subject:to;        bh=jBtIY1TPrdqaxfJPzm1ZJwzCfOJJTYjy+8WLI6uzrXY=;        b=hGVXMS5eISqAFq/s3jKJEfnZx646CaTW3TM8mtNLS+uqMQ17Dnb4wRsJi38307wEdy         /3MwqjrYg93jqLREBcfZ/IWPPXcQIyvQcp1i0hd6poxYlA5cdnijkFc+/eBEUWrNApjw         167sLdCPdrVFkZWDhb3WwJphilse7KRODhM6pLuKDAYS6GzGYRAyH+21PePVxCKFuMl4         dQR+GUdY7ZyZIKX96e0IJKJQnxsfFzZxy1wV5534jPu4txDDmrcoz5cE09pjTuKXmxSW         0YFT6QMk47RmUdYf/vv9IYtb1eXXJvmBNcNQmylQyFLdr3ze9upNhSnTuBNrLDvHLqaY         EiRQ==',
      To: 'admins@testcollective.opencollective.com',
      'Dkim-Signature':
        'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=gmail.com; s=20120113;        h=mime-version:reply-to:from:date:message-id:subject:to;        bh=jBtIY1TPrdqaxfJPzm1ZJwzCfOJJTYjy+8WLI6uzrXY=;        b=rUTYZ5U9SCRCQzKvnL5LIweGa18pKDcA8s8U60BPuDwvo4NcJwD2iyBLT1KrbjvJF3         lE3hn8ee9nwyMEOX/EQfAixj6M73I2ihm9ELoO6fjRFvx4Yh1YU9wT1XaNaNBrietjaU         yos555+uiVzo3iZ8SjypyxjvtcBLMxN3Y4qgwKoc6DZd+rNpvO4sSyS6cCXN0+6tf5hF         5RGs2tFBKYEisnJ4oWsocTFQonDl9xUG/KcPA3/1Er+2joMmU2T0ydRTPd7CP/MDcwH/         pq7IbzY6jOhoexpEWiPx+tJMWLxhy5dfp9xVyW1lcPgj5FfCQKrdATwr5rrtOfhCpvAu         yQpw==',
      subject: 'test collective admins',
      from: 'Xavier Damman <xdamman+test@gmail.com>',
      'X-Received':
        'by 10.37.76.196 with SMTP id z187mr11307770yba.176.1471441673982; Wed, 17 Aug 2016 06:47:53 -0700 (PDT)',
      Date: 'Wed, 17 Aug 2016 15:47:33 +0200',
      'Message-Id':
        '<CAFPTvg8=jZOVHseLCUZZZqCMnjkVKURatoZPufBdyf1-oj4r1g@mail.gmail.com>',
      'Mime-Version': '1.0',
      Received: [
        'from mail-yb0-f196.google.com (mail-yb0-f196.google.com [209.85.213.196]) by mxa.mailgun.org with ESMTP id 57b46b0a.7f918f2082f0-in6; Wed, 17 Aug 2016 13:47:54 -0000 (UTC)',
        'by mail-yb0-f196.google.com with SMTP id e31so2965976ybi.0        for <admins@testcollective.opencollective.com>; Wed, 17 Aug 2016 06:47:54 -0700 (PDT)',
        'by 10.83.8.193 with HTTP; Wed, 17 Aug 2016 06:47:33 -0700 (PDT)',
      ],
      'message-url':
        'https://so.api.mailgun.net/v3/domains/opencollective.com/messages/eyJwIjpmYWxzZSwiayI6Ijc3NjFlZTBjLTc1NGQtNGIwZi05ZDlkLWU1NTgxODJkMTlkOSIsInMiOiI2NDhjZDg1ZTE1IiwiYyI6InNhb3JkIn0=',
      'Reply-To': 'xdamman+test@gmail.com',
      sender: 'xdamman+test@gmail.com',
      'X-Mailgun-Incoming': 'Yes',
      'X-Gm-Message-State':
        'AEkoouvhAPIlNqgdreR9h0X1gAk9o8+dwYgBi+Rh+/MfQYBc3WJxRUk9FfYz2iRg+r5HUBedy/i8FMvnL81QUQ==',
      'message-headers':
        '[["X-Mailgun-Incoming", "Yes"], ["X-Envelope-From", "<xdamman+test@gmail.com>"], ["Received", "from mail-yb0-f196.google.com (mail-yb0-f196.google.com [209.85.213.196]) by mxa.mailgun.org with ESMTP id 57b46b0a.7f918f2082f0-in6; Wed, 17 Aug 2016 13:47:54 -0000 (UTC)"], ["Received", "by mail-yb0-f196.google.com with SMTP id e31so2965976ybi.0        for <admins@testcollective.opencollective.com>; Wed, 17 Aug 2016 06:47:54 -0700 (PDT)"], ["Dkim-Signature", "v=1; a=rsa-sha256; c=relaxed/relaxed;        d=gmail.com; s=20120113;        h=mime-version:reply-to:from:date:message-id:subject:to;        bh=jBtIY1TPrdqaxfJPzm1ZJwzCfOJJTYjy+8WLI6uzrXY=;        b=rUTYZ5U9SCRCQzKvnL5LIweGa18pKDcA8s8U60BPuDwvo4NcJwD2iyBLT1KrbjvJF3         lE3hn8ee9nwyMEOX/EQfAixj6M73I2ihm9ELoO6fjRFvx4Yh1YU9wT1XaNaNBrietjaU         yos555+uiVzo3iZ8SjypyxjvtcBLMxN3Y4qgwKoc6DZd+rNpvO4sSyS6cCXN0+6tf5hF         5RGs2tFBKYEisnJ4oWsocTFQonDl9xUG/KcPA3/1Er+2joMmU2T0ydRTPd7CP/MDcwH/         pq7IbzY6jOhoexpEWiPx+tJMWLxhy5dfp9xVyW1lcPgj5FfCQKrdATwr5rrtOfhCpvAu         yQpw=="], ["X-Google-Dkim-Signature", "v=1; a=rsa-sha256; c=relaxed/relaxed;        d=1e100.net; s=20130820;        h=x-gm-message-state:mime-version:reply-to:from:date:message-id         :subject:to;        bh=jBtIY1TPrdqaxfJPzm1ZJwzCfOJJTYjy+8WLI6uzrXY=;        b=hGVXMS5eISqAFq/s3jKJEfnZx646CaTW3TM8mtNLS+uqMQ17Dnb4wRsJi38307wEdy         /3MwqjrYg93jqLREBcfZ/IWPPXcQIyvQcp1i0hd6poxYlA5cdnijkFc+/eBEUWrNApjw         167sLdCPdrVFkZWDhb3WwJphilse7KRODhM6pLuKDAYS6GzGYRAyH+21PePVxCKFuMl4         dQR+GUdY7ZyZIKX96e0IJKJQnxsfFzZxy1wV5534jPu4txDDmrcoz5cE09pjTuKXmxSW         0YFT6QMk47RmUdYf/vv9IYtb1eXXJvmBNcNQmylQyFLdr3ze9upNhSnTuBNrLDvHLqaY         EiRQ=="], ["X-Gm-Message-State", "AEkoouvhAPIlNqgdreR9h0X1gAk9o8+dwYgBi+Rh+/MfQYBc3WJxRUk9FfYz2iRg+r5HUBedy/i8FMvnL81QUQ=="], ["X-Received", "by 10.37.76.196 with SMTP id z187mr11307770yba.176.1471441673982; Wed, 17 Aug 2016 06:47:53 -0700 (PDT)"], ["Mime-Version", "1.0"], ["Received", "by 10.83.8.193 with HTTP; Wed, 17 Aug 2016 06:47:33 -0700 (PDT)"], ["Reply-To", "xdamman+test@gmail.com"], ["From", "Xavier Damman <xdamman+test@gmail.com>"], ["Date", "Wed, 17 Aug 2016 15:47:33 +0200"], ["Message-Id", "<CAFPTvg8=jZOVHseLCUZZZqCMnjkVKURatoZPufBdyf1-oj4r1g@mail.gmail.com>"], ["Subject", "test collective admins"], ["To", "admins@testcollective.opencollective.com"], ["Content-Type", "multipart/alternative; boundary=\\"001a113e78ac491d42053a44b6e5\\""]]',
      'Content-Type':
        'multipart/alternative; boundary="001a113e78ac491d42053a44b6e5"',
      Subject: 'test collective admins',
      timestamp: '1471442294',
      token: '0a8cf930ca80d696d093c205b4dac4f10a0cbd3f2ed6a541bf',
      signature:
        'aea76a2321d74068801a16b6f0bf906cd996d8cc62f481336939b1a4eaec680c',
      'body-plain':
        'hello world with *some* *html*\r\n\r\nand some links <http://opencollective.com/>\r\n\r\nCoo!\r\n',
      'body-html':
        '<div dir="ltr"><span style="font-size:13px">hello world with&nbsp;</span><b style="font-size:13px">some</b><span style="font-size:13px">&nbsp;</span><i style="font-size:13px">html</i><div style="font-size:13px"><br></div><div style="font-size:13px">and some&nbsp;<a href="http://opencollective.com/" target="_blank">links</a></div><div style="font-size:13px"><br></div><div style="font-size:13px">Coo!</div></div>\r\n',
      'stripped-html':
        '<div dir="ltr"><span style="font-size:13px">hello world with&nbsp;</span><b style="font-size:13px">some</b><span style="font-size:13px">&nbsp;</span><i style="font-size:13px">html</i><div style="font-size:13px"><br></div><div style="font-size:13px">and some&nbsp;<a href="http://opencollective.com/" target="_blank">links</a></div><div style="font-size:13px"><br></div><div style="font-size:13px">Coo!</div></div>\n',
      'stripped-text':
        'hello world with *some* *html*\r\n\r\nand some links <http://opencollective.com/>\r\n\r\nCoo!',
      'stripped-signature': '',
    })
    .reply(200, 'ok', {
      'x-powered-by': 'Express',
      'access-control-allow-origin': '*',
      'content-type': 'text/html; charset=utf-8',
      'content-length': '2',
      etag: 'W/"2-REvLOj/Pg4kpbElGfyfh1g"',
      date: 'Fri, 19 Aug 2016 16:15:40 GMT',
      connection: 'close',
    });

  nock('http://127.0.0.1:62356')
    .post('/webhooks/mailgun', {
      domain: 'opencollective.com',
      From: 'Xavier Damman <xdamman+test@gmail.com>',
      'X-Envelope-From': '<xdamman+test@gmail.com>',
      'X-Google-Dkim-Signature':
        'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=1e100.net; s=20130820;        h=x-gm-message-state:mime-version:reply-to:from:date:message-id         :subject:to;        bh=jBtIY1TPrdqaxfJPzm1ZJwzCfOJJTYjy+8WLI6uzrXY=;        b=hGVXMS5eISqAFq/s3jKJEfnZx646CaTW3TM8mtNLS+uqMQ17Dnb4wRsJi38307wEdy         /3MwqjrYg93jqLREBcfZ/IWPPXcQIyvQcp1i0hd6poxYlA5cdnijkFc+/eBEUWrNApjw         167sLdCPdrVFkZWDhb3WwJphilse7KRODhM6pLuKDAYS6GzGYRAyH+21PePVxCKFuMl4         dQR+GUdY7ZyZIKX96e0IJKJQnxsfFzZxy1wV5534jPu4txDDmrcoz5cE09pjTuKXmxSW         0YFT6QMk47RmUdYf/vv9IYtb1eXXJvmBNcNQmylQyFLdr3ze9upNhSnTuBNrLDvHLqaY         EiRQ==',
      To: 'admins@testcollective.opencollective.com',
      'Dkim-Signature':
        'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=gmail.com; s=20120113;        h=mime-version:reply-to:from:date:message-id:subject:to;        bh=jBtIY1TPrdqaxfJPzm1ZJwzCfOJJTYjy+8WLI6uzrXY=;        b=rUTYZ5U9SCRCQzKvnL5LIweGa18pKDcA8s8U60BPuDwvo4NcJwD2iyBLT1KrbjvJF3         lE3hn8ee9nwyMEOX/EQfAixj6M73I2ihm9ELoO6fjRFvx4Yh1YU9wT1XaNaNBrietjaU         yos555+uiVzo3iZ8SjypyxjvtcBLMxN3Y4qgwKoc6DZd+rNpvO4sSyS6cCXN0+6tf5hF         5RGs2tFBKYEisnJ4oWsocTFQonDl9xUG/KcPA3/1Er+2joMmU2T0ydRTPd7CP/MDcwH/         pq7IbzY6jOhoexpEWiPx+tJMWLxhy5dfp9xVyW1lcPgj5FfCQKrdATwr5rrtOfhCpvAu         yQpw==',
      subject: 'test collective admins',
      from: 'Xavier Damman <xdamman+test@gmail.com>',
      'X-Received':
        'by 10.37.76.196 with SMTP id z187mr11307770yba.176.1471441673982; Wed, 17 Aug 2016 06:47:53 -0700 (PDT)',
      Date: 'Wed, 17 Aug 2016 15:47:33 +0200',
      'Message-Id':
        '<CAFPTvg8=jZOVHseLCUZZZqCMnjkVKURatoZPufBdyf1-oj4r1g@mail.gmail.com>',
      'Mime-Version': '1.0',
      Received: [
        'from mail-yb0-f196.google.com (mail-yb0-f196.google.com [209.85.213.196]) by mxa.mailgun.org with ESMTP id 57b46b0a.7f918f2082f0-in6; Wed, 17 Aug 2016 13:47:54 -0000 (UTC)',
        'by mail-yb0-f196.google.com with SMTP id e31so2965976ybi.0        for <admins@testcollective.opencollective.com>; Wed, 17 Aug 2016 06:47:54 -0700 (PDT)',
        'by 10.83.8.193 with HTTP; Wed, 17 Aug 2016 06:47:33 -0700 (PDT)',
      ],
      'message-url':
        'https://so.api.mailgun.net/v3/domains/opencollective.com/messages/eyJwIjpmYWxzZSwiayI6Ijc3NjFlZTBjLTc1NGQtNGIwZi05ZDlkLWU1NTgxODJkMTlkOSIsInMiOiI2NDhjZDg1ZTE1IiwiYyI6InNhb3JkIn0=',
      'Reply-To': 'xdamman+test@gmail.com',
      recipient: 'admins@testcollective.opencollective.com',
      sender: 'xdamman+test@gmail.com',
      'X-Mailgun-Incoming': 'Yes',
      'X-Gm-Message-State':
        'AEkoouvhAPIlNqgdreR9h0X1gAk9o8+dwYgBi+Rh+/MfQYBc3WJxRUk9FfYz2iRg+r5HUBedy/i8FMvnL81QUQ==',
      'message-headers':
        '[["X-Mailgun-Incoming", "Yes"], ["X-Envelope-From", "<xdamman+test@gmail.com>"], ["Received", "from mail-yb0-f196.google.com (mail-yb0-f196.google.com [209.85.213.196]) by mxa.mailgun.org with ESMTP id 57b46b0a.7f918f2082f0-in6; Wed, 17 Aug 2016 13:47:54 -0000 (UTC)"], ["Received", "by mail-yb0-f196.google.com with SMTP id e31so2965976ybi.0        for <admins@testcollective.opencollective.com>; Wed, 17 Aug 2016 06:47:54 -0700 (PDT)"], ["Dkim-Signature", "v=1; a=rsa-sha256; c=relaxed/relaxed;        d=gmail.com; s=20120113;        h=mime-version:reply-to:from:date:message-id:subject:to;        bh=jBtIY1TPrdqaxfJPzm1ZJwzCfOJJTYjy+8WLI6uzrXY=;        b=rUTYZ5U9SCRCQzKvnL5LIweGa18pKDcA8s8U60BPuDwvo4NcJwD2iyBLT1KrbjvJF3         lE3hn8ee9nwyMEOX/EQfAixj6M73I2ihm9ELoO6fjRFvx4Yh1YU9wT1XaNaNBrietjaU         yos555+uiVzo3iZ8SjypyxjvtcBLMxN3Y4qgwKoc6DZd+rNpvO4sSyS6cCXN0+6tf5hF         5RGs2tFBKYEisnJ4oWsocTFQonDl9xUG/KcPA3/1Er+2joMmU2T0ydRTPd7CP/MDcwH/         pq7IbzY6jOhoexpEWiPx+tJMWLxhy5dfp9xVyW1lcPgj5FfCQKrdATwr5rrtOfhCpvAu         yQpw=="], ["X-Google-Dkim-Signature", "v=1; a=rsa-sha256; c=relaxed/relaxed;        d=1e100.net; s=20130820;        h=x-gm-message-state:mime-version:reply-to:from:date:message-id         :subject:to;        bh=jBtIY1TPrdqaxfJPzm1ZJwzCfOJJTYjy+8WLI6uzrXY=;        b=hGVXMS5eISqAFq/s3jKJEfnZx646CaTW3TM8mtNLS+uqMQ17Dnb4wRsJi38307wEdy         /3MwqjrYg93jqLREBcfZ/IWPPXcQIyvQcp1i0hd6poxYlA5cdnijkFc+/eBEUWrNApjw         167sLdCPdrVFkZWDhb3WwJphilse7KRODhM6pLuKDAYS6GzGYRAyH+21PePVxCKFuMl4         dQR+GUdY7ZyZIKX96e0IJKJQnxsfFzZxy1wV5534jPu4txDDmrcoz5cE09pjTuKXmxSW         0YFT6QMk47RmUdYf/vv9IYtb1eXXJvmBNcNQmylQyFLdr3ze9upNhSnTuBNrLDvHLqaY         EiRQ=="], ["X-Gm-Message-State", "AEkoouvhAPIlNqgdreR9h0X1gAk9o8+dwYgBi+Rh+/MfQYBc3WJxRUk9FfYz2iRg+r5HUBedy/i8FMvnL81QUQ=="], ["X-Received", "by 10.37.76.196 with SMTP id z187mr11307770yba.176.1471441673982; Wed, 17 Aug 2016 06:47:53 -0700 (PDT)"], ["Mime-Version", "1.0"], ["Received", "by 10.83.8.193 with HTTP; Wed, 17 Aug 2016 06:47:33 -0700 (PDT)"], ["Reply-To", "xdamman+test@gmail.com"], ["From", "Xavier Damman <xdamman+test@gmail.com>"], ["Date", "Wed, 17 Aug 2016 15:47:33 +0200"], ["Message-Id", "<CAFPTvg8=jZOVHseLCUZZZqCMnjkVKURatoZPufBdyf1-oj4r1g@mail.gmail.com>"], ["Subject", "test collective admins"], ["To", "admins@testcollective.opencollective.com"], ["Content-Type", "multipart/alternative; boundary=\\"001a113e78ac491d42053a44b6e5\\""]]',
      'Content-Type':
        'multipart/alternative; boundary="001a113e78ac491d42053a44b6e5"',
      Subject: 'test collective admins',
      timestamp: '1471442294',
      token: '0a8cf930ca80d696d093c205b4dac4f10a0cbd3f2ed6a541bf',
      signature:
        'aea76a2321d74068801a16b6f0bf906cd996d8cc62f481336939b1a4eaec680c',
      'body-plain':
        'hello world with *some* *html*\r\n\r\nand some links <http://opencollective.com/>\r\n\r\nCoo!\r\n',
      'body-html':
        '<div dir="ltr"><span style="font-size:13px">hello world with&nbsp;</span><b style="font-size:13px">some</b><span style="font-size:13px">&nbsp;</span><i style="font-size:13px">html</i><div style="font-size:13px"><br></div><div style="font-size:13px">and some&nbsp;<a href="http://opencollective.com/" target="_blank">links</a></div><div style="font-size:13px"><br></div><div style="font-size:13px">Coo!</div></div>\r\n',
      'stripped-html':
        '<div dir="ltr"><span style="font-size:13px">hello world with&nbsp;</span><b style="font-size:13px">some</b><span style="font-size:13px">&nbsp;</span><i style="font-size:13px">html</i><div style="font-size:13px"><br></div><div style="font-size:13px">and some&nbsp;<a href="http://opencollective.com/" target="_blank">links</a></div><div style="font-size:13px"><br></div><div style="font-size:13px">Coo!</div></div>\n',
      'stripped-text':
        'hello world with *some* *html*\r\n\r\nand some links <http://opencollective.com/>\r\n\r\nCoo!',
      'stripped-signature': '',
    })
    .reply(200, 'Mailgun webhook processed successfully', {
      'x-powered-by': 'Express',
      'access-control-allow-origin': '*',
      'content-type': 'text/html; charset=utf-8',
      'content-length': '38',
      etag: 'W/"26-sIRcrs1WrQa4vv4e0UE3tQ"',
      date: 'Fri, 19 Aug 2016 16:15:40 GMT',
      connection: 'close',
    });

  nock('https://so.api.mailgun.net:443')
    .get(
      '/v3/domains/opencollective.com/messages/eyJwIjpmYWxzZSwiayI6Ijc3NjFlZTBjLTc1NGQtNGIwZi05ZDlkLWU1NTgxODJkMTlkOSIsInMiOiI2NDhjZDg1ZTE1IiwiYyI6InNhb3JkIn0=',
    )
    .reply(
      200,
      {
        Received:
          'by 10.83.8.193 with HTTP; Wed, 17 Aug 2016 06:47:33 -0700 (PDT)',
        'stripped-signature': '',
        From: 'Xavier Damman <xdamman+test@gmail.com>',
        'X-Envelope-From': '<xdamman+test@gmail.com>',
        recipients: 'admins@testcollective.opencollective.com',
        'X-Google-Dkim-Signature':
          'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=1e100.net; s=20130820;        h=x-gm-message-state:mime-version:reply-to:from:date:message-id         :subject:to;        bh=jBtIY1TPrdqaxfJPzm1ZJwzCfOJJTYjy+8WLI6uzrXY=;        b=hGVXMS5eISqAFq/s3jKJEfnZx646CaTW3TM8mtNLS+uqMQ17Dnb4wRsJi38307wEdy         /3MwqjrYg93jqLREBcfZ/IWPPXcQIyvQcp1i0hd6poxYlA5cdnijkFc+/eBEUWrNApjw         167sLdCPdrVFkZWDhb3WwJphilse7KRODhM6pLuKDAYS6GzGYRAyH+21PePVxCKFuMl4         dQR+GUdY7ZyZIKX96e0IJKJQnxsfFzZxy1wV5534jPu4txDDmrcoz5cE09pjTuKXmxSW         0YFT6QMk47RmUdYf/vv9IYtb1eXXJvmBNcNQmylQyFLdr3ze9upNhSnTuBNrLDvHLqaY         EiRQ==',
        To: 'admins@testcollective.opencollective.com',
        'message-headers': [
          ['X-Mailgun-Incoming', 'Yes'],
          ['X-Envelope-From', '<xdamman+test@gmail.com>'],
          [
            'Received',
            'from mail-yb0-f196.google.com (mail-yb0-f196.google.com [209.85.213.196]) by mxa.mailgun.org with ESMTP id 57b46b0a.7f918f2082f0-in6; Wed, 17 Aug 2016 13:47:54 -0000 (UTC)',
          ],
          [
            'Received',
            'by mail-yb0-f196.google.com with SMTP id e31so2965976ybi.0        for <admins@testcollective.opencollective.com>; Wed, 17 Aug 2016 06:47:54 -0700 (PDT)',
          ],
          [
            'Dkim-Signature',
            'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=gmail.com; s=20120113;        h=mime-version:reply-to:from:date:message-id:subject:to;        bh=jBtIY1TPrdqaxfJPzm1ZJwzCfOJJTYjy+8WLI6uzrXY=;        b=rUTYZ5U9SCRCQzKvnL5LIweGa18pKDcA8s8U60BPuDwvo4NcJwD2iyBLT1KrbjvJF3         lE3hn8ee9nwyMEOX/EQfAixj6M73I2ihm9ELoO6fjRFvx4Yh1YU9wT1XaNaNBrietjaU         yos555+uiVzo3iZ8SjypyxjvtcBLMxN3Y4qgwKoc6DZd+rNpvO4sSyS6cCXN0+6tf5hF         5RGs2tFBKYEisnJ4oWsocTFQonDl9xUG/KcPA3/1Er+2joMmU2T0ydRTPd7CP/MDcwH/         pq7IbzY6jOhoexpEWiPx+tJMWLxhy5dfp9xVyW1lcPgj5FfCQKrdATwr5rrtOfhCpvAu         yQpw==',
          ],
          [
            'X-Google-Dkim-Signature',
            'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=1e100.net; s=20130820;        h=x-gm-message-state:mime-version:reply-to:from:date:message-id         :subject:to;        bh=jBtIY1TPrdqaxfJPzm1ZJwzCfOJJTYjy+8WLI6uzrXY=;        b=hGVXMS5eISqAFq/s3jKJEfnZx646CaTW3TM8mtNLS+uqMQ17Dnb4wRsJi38307wEdy         /3MwqjrYg93jqLREBcfZ/IWPPXcQIyvQcp1i0hd6poxYlA5cdnijkFc+/eBEUWrNApjw         167sLdCPdrVFkZWDhb3WwJphilse7KRODhM6pLuKDAYS6GzGYRAyH+21PePVxCKFuMl4         dQR+GUdY7ZyZIKX96e0IJKJQnxsfFzZxy1wV5534jPu4txDDmrcoz5cE09pjTuKXmxSW         0YFT6QMk47RmUdYf/vv9IYtb1eXXJvmBNcNQmylQyFLdr3ze9upNhSnTuBNrLDvHLqaY         EiRQ==',
          ],
          [
            'X-Gm-Message-State',
            'AEkoouvhAPIlNqgdreR9h0X1gAk9o8+dwYgBi+Rh+/MfQYBc3WJxRUk9FfYz2iRg+r5HUBedy/i8FMvnL81QUQ==',
          ],
          [
            'X-Received',
            'by 10.37.76.196 with SMTP id z187mr11307770yba.176.1471441673982; Wed, 17 Aug 2016 06:47:53 -0700 (PDT)',
          ],
          ['Mime-Version', '1.0'],
          [
            'Received',
            'by 10.83.8.193 with HTTP; Wed, 17 Aug 2016 06:47:33 -0700 (PDT)',
          ],
          ['Reply-To', 'xdamman+test@gmail.com'],
          ['From', 'Xavier Damman <xdamman+test@gmail.com>'],
          ['Date', 'Wed, 17 Aug 2016 15:47:33 +0200'],
          [
            'Message-Id',
            '<CAFPTvg8=jZOVHseLCUZZZqCMnjkVKURatoZPufBdyf1-oj4r1g@mail.gmail.com>',
          ],
          ['Subject', 'test collective admins'],
          ['To', 'admins@testcollective.opencollective.com'],
          [
            'Content-Type',
            'multipart/alternative; boundary="001a113e78ac491d42053a44b6e5"',
          ],
        ],
        'Dkim-Signature':
          'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=gmail.com; s=20120113;        h=mime-version:reply-to:from:date:message-id:subject:to;        bh=jBtIY1TPrdqaxfJPzm1ZJwzCfOJJTYjy+8WLI6uzrXY=;        b=rUTYZ5U9SCRCQzKvnL5LIweGa18pKDcA8s8U60BPuDwvo4NcJwD2iyBLT1KrbjvJF3         lE3hn8ee9nwyMEOX/EQfAixj6M73I2ihm9ELoO6fjRFvx4Yh1YU9wT1XaNaNBrietjaU         yos555+uiVzo3iZ8SjypyxjvtcBLMxN3Y4qgwKoc6DZd+rNpvO4sSyS6cCXN0+6tf5hF         5RGs2tFBKYEisnJ4oWsocTFQonDl9xUG/KcPA3/1Er+2joMmU2T0ydRTPd7CP/MDcwH/         pq7IbzY6jOhoexpEWiPx+tJMWLxhy5dfp9xVyW1lcPgj5FfCQKrdATwr5rrtOfhCpvAu         yQpw==',
        'content-id-map': {},
        'Reply-To': 'xdamman+test@gmail.com',
        subject: 'test collective admins',
        'stripped-html':
          '<div dir="ltr"><span style="font-size:13px">hello world with&nbsp;</span><b style="font-size:13px">some</b><span style="font-size:13px">&nbsp;</span><i style="font-size:13px">html</i><div style="font-size:13px"><br></div><div style="font-size:13px">and some&nbsp;<a href="http://opencollective.com/" target="_blank">links</a></div><div style="font-size:13px"><br></div><div style="font-size:13px">Coo!</div></div>\n',
        from: 'Xavier Damman <xdamman+test@gmail.com>',
        sender: 'xdamman+test@gmail.com',
        'stripped-text':
          'hello world with *some* *html*\r\n\r\nand some links <http://opencollective.com/>\r\n\r\nCoo!',
        'X-Mailgun-Incoming': 'Yes',
        'X-Received':
          'by 10.37.76.196 with SMTP id z187mr11307770yba.176.1471441673982; Wed, 17 Aug 2016 06:47:53 -0700 (PDT)',
        'X-Gm-Message-State':
          'AEkoouvhAPIlNqgdreR9h0X1gAk9o8+dwYgBi+Rh+/MfQYBc3WJxRUk9FfYz2iRg+r5HUBedy/i8FMvnL81QUQ==',
        attachments: [],
        'body-html':
          '<div dir="ltr"><span style="font-size:13px">hello world with&nbsp;</span><b style="font-size:13px">some</b><span style="font-size:13px">&nbsp;</span><i style="font-size:13px">html</i><div style="font-size:13px"><br></div><div style="font-size:13px">and some&nbsp;<a href="http://opencollective.com/" target="_blank">links</a></div><div style="font-size:13px"><br></div><div style="font-size:13px">Coo!</div></div>\r\n',
        'Mime-Version': '1.0',
        Date: 'Wed, 17 Aug 2016 15:47:33 +0200',
        'Message-Id':
          '<CAFPTvg8=jZOVHseLCUZZZqCMnjkVKURatoZPufBdyf1-oj4r1g@mail.gmail.com>',
        'Content-Type':
          'multipart/alternative; boundary="001a113e78ac491d42053a44b6e5"',
        'body-plain':
          'hello world with *some* *html*\r\n\r\nand some links <http://opencollective.com/>\r\n\r\nCoo!\r\n',
        Subject: 'test collective admins',
      },
      {
        server: 'nginx',
        date: 'Fri, 19 Aug 2016 16:15:41 GMT',
        'content-type': 'application/json; charset="utf-8"',
        'content-length': '5883',
        connection: 'close',
      },
    );

  nock('http://127.0.0.1:62358')
    .get('/services/email/approve')
    .query({
      messageId:
        'eyJwIjpmYWxzZSwiayI6Ijc3NjFlZTBjLTc1NGQtNGIwZi05ZDlkLWU1NTgxODJkMTlkOSIsInMiOiI2NDhjZDg1ZTE1IiwiYyI6InNhb3JkIn0',
      approver: 'asood123%2Btest%40gmail.com',
    })
    .reply(
      200,
      'Email from xdamman+test@gmail.com with subject "test collective admins" approved for the admins@testcollective.opencollective.com mailing list',
      {
        'x-powered-by': 'Express',
        'access-control-allow-origin': '*',
        'content-type': 'text/html; charset=utf-8',
        'content-length': '139',
        etag: 'W/"8b-rTYyNpNxVQPb3p+HWJXtCw"',
        date: 'Fri, 19 Aug 2016 16:15:42 GMT',
        connection: 'close',
      },
    );

  nock('https://so.api.mailgun.net:443')
    .get(
      '/v3/domains/opencollective.com/messages/eyJwIjpmYWxzZSwiayI6IjY5MTdlYTZlLWVhNzctNGQzOC04OGUxLWMzMTQwMzdmNGRhNiIsInMiOiIwMjNjMzgwYWFlIiwiYyI6InNhaWFkIn0=',
    )
    .reply(
      404,
      { message: 'Message not found' },
      {
        server: 'nginx',
        date: 'Fri, 19 Aug 2016 16:15:42 GMT',
        'content-type': 'application/json',
        'content-length': '36',
        connection: 'close',
      },
    );

  nock('http://127.0.0.1:62361')
    .get('/services/email/approve')
    .query({
      messageId:
        'eyJwIjpmYWxzZSwiayI6IjY5MTdlYTZlLWVhNzctNGQzOC04OGUxLWMzMTQwMzdmNGRhNiIsInMiOiIwMjNjMzgwYWFlIiwiYyI6InNhaWFkIn0',
      approver: 'xdamman%40gmail.com',
    })
    .reply(
      404,
      {
        error: {
          code: 404,
          type: 'not_found',
          message:
            'Message eyJwIjpmYWxzZSwiayI6IjY5MTdlYTZlLWVhNzctNGQzOC04OGUxLWMzMTQwMzdmNGRhNiIsInMiOiIwMjNjMzgwYWFlIiwiYyI6InNhaWFkIn0= not found',
        },
      },
      {
        'x-powered-by': 'Express',
        'access-control-allow-origin': '*',
        'cache-control': 'no-cache',
        'content-type': 'application/json; charset=utf-8',
        'content-length': '184',
        etag: 'W/"b8-A0be2BUBMl1F96l+eoG7Bw"',
        date: 'Fri, 19 Aug 2016 16:15:42 GMT',
        connection: 'close',
      },
    );
}

nock('https://so.api.mailgun.net:443')
  .get(
    '/v3/domains/opencollective.com/messages/abJwIjpmYWxzZSwiayI6Ijc3NjFlZTBjLTc1NGQtNGIwZi05ZDlkLWU1NTgxODJkMTlkOSIsInMiOiI2NDhjZDg1ZTE1IiwiYyI6InNhb3JkIn0=',
  )
  .reply(
    200,
    {
      Received:
        'by 10.83.8.193 with HTTP; Wed, 17 Aug 2016 06:47:33 -0700 (PDT)',
      'stripped-signature': '',
      From: 'Xavier Damman <xdamman+test@gmail.com>',
      'X-Envelope-From': '<xdamman+test@gmail.com>',
      recipients: 'event1-ev111@testcollective.opencollective.com',
      'X-Google-Dkim-Signature':
        'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=1e100.net; s=20130820;        h=x-gm-message-state:mime-version:reply-to:from:date:message-id         :subject:to;        bh=jBtIY1TPrdqaxfJPzm1ZJwzCfOJJTYjy+8WLI6uzrXY=;        b=hGVXMS5eISqAFq/s3jKJEfnZx646CaTW3TM8mtNLS+uqMQ17Dnb4wRsJi38307wEdy         /3MwqjrYg93jqLREBcfZ/IWPPXcQIyvQcp1i0hd6poxYlA5cdnijkFc+/eBEUWrNApjw         167sLdCPdrVFkZWDhb3WwJphilse7KRODhM6pLuKDAYS6GzGYRAyH+21PePVxCKFuMl4         dQR+GUdY7ZyZIKX96e0IJKJQnxsfFzZxy1wV5534jPu4txDDmrcoz5cE09pjTuKXmxSW         0YFT6QMk47RmUdYf/vv9IYtb1eXXJvmBNcNQmylQyFLdr3ze9upNhSnTuBNrLDvHLqaY         EiRQ==',
      To: 'event1-ev111@testcollective.opencollective.com',
      'message-headers': [
        ['X-Mailgun-Incoming', 'Yes'],
        ['X-Envelope-From', '<xdamman+test@gmail.com>'],
        [
          'Received',
          'from mail-yb0-f196.google.com (mail-yb0-f196.google.com [209.85.213.196]) by mxa.mailgun.org with ESMTP id 57b46b0a.7f918f2082f0-in6; Wed, 17 Aug 2016 13:47:54 -0000 (UTC)',
        ],
        [
          'Received',
          'by mail-yb0-f196.google.com with SMTP id e31so2965976ybi.0        for <event1-ev111@testcollective.opencollective.com>; Wed, 17 Aug 2016 06:47:54 -0700 (PDT)',
        ],
        [
          'Dkim-Signature',
          'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=gmail.com; s=20120113;        h=mime-version:reply-to:from:date:message-id:subject:to;        bh=jBtIY1TPrdqaxfJPzm1ZJwzCfOJJTYjy+8WLI6uzrXY=;        b=rUTYZ5U9SCRCQzKvnL5LIweGa18pKDcA8s8U60BPuDwvo4NcJwD2iyBLT1KrbjvJF3         lE3hn8ee9nwyMEOX/EQfAixj6M73I2ihm9ELoO6fjRFvx4Yh1YU9wT1XaNaNBrietjaU         yos555+uiVzo3iZ8SjypyxjvtcBLMxN3Y4qgwKoc6DZd+rNpvO4sSyS6cCXN0+6tf5hF         5RGs2tFBKYEisnJ4oWsocTFQonDl9xUG/KcPA3/1Er+2joMmU2T0ydRTPd7CP/MDcwH/         pq7IbzY6jOhoexpEWiPx+tJMWLxhy5dfp9xVyW1lcPgj5FfCQKrdATwr5rrtOfhCpvAu         yQpw==',
        ],
        [
          'X-Google-Dkim-Signature',
          'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=1e100.net; s=20130820;        h=x-gm-message-state:mime-version:reply-to:from:date:message-id         :subject:to;        bh=jBtIY1TPrdqaxfJPzm1ZJwzCfOJJTYjy+8WLI6uzrXY=;        b=hGVXMS5eISqAFq/s3jKJEfnZx646CaTW3TM8mtNLS+uqMQ17Dnb4wRsJi38307wEdy         /3MwqjrYg93jqLREBcfZ/IWPPXcQIyvQcp1i0hd6poxYlA5cdnijkFc+/eBEUWrNApjw         167sLdCPdrVFkZWDhb3WwJphilse7KRODhM6pLuKDAYS6GzGYRAyH+21PePVxCKFuMl4         dQR+GUdY7ZyZIKX96e0IJKJQnxsfFzZxy1wV5534jPu4txDDmrcoz5cE09pjTuKXmxSW         0YFT6QMk47RmUdYf/vv9IYtb1eXXJvmBNcNQmylQyFLdr3ze9upNhSnTuBNrLDvHLqaY         EiRQ==',
        ],
        [
          'X-Gm-Message-State',
          'AEkoouvhAPIlNqgdreR9h0X1gAk9o8+dwYgBi+Rh+/MfQYBc3WJxRUk9FfYz2iRg+r5HUBedy/i8FMvnL81QUQ==',
        ],
        [
          'X-Received',
          'by 10.37.76.196 with SMTP id z187mr11307770yba.176.1471441673982; Wed, 17 Aug 2016 06:47:53 -0700 (PDT)',
        ],
        ['Mime-Version', '1.0'],
        [
          'Received',
          'by 10.83.8.193 with HTTP; Wed, 17 Aug 2016 06:47:33 -0700 (PDT)',
        ],
        ['Reply-To', 'xdamman+test@gmail.com'],
        ['From', 'Xavier Damman <xdamman+test@gmail.com>'],
        ['Date', 'Wed, 17 Aug 2016 15:47:33 +0200'],
        [
          'Message-Id',
          '<CAFPTvg8=jZOVHseLCUZZZqCMnjkVKURatoZPufBdyf1-oj4r1g@mail.gmail.com>',
        ],
        ['Subject', 'email reminder for event 1'],
        ['To', 'event1-ev111@testcollective.opencollective.com'],
        [
          'Content-Type',
          'multipart/alternative; boundary="001a113e78ac491d42053a44b6e5"',
        ],
      ],
      'Dkim-Signature':
        'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=gmail.com; s=20120113;        h=mime-version:reply-to:from:date:message-id:subject:to;        bh=jBtIY1TPrdqaxfJPzm1ZJwzCfOJJTYjy+8WLI6uzrXY=;        b=rUTYZ5U9SCRCQzKvnL5LIweGa18pKDcA8s8U60BPuDwvo4NcJwD2iyBLT1KrbjvJF3         lE3hn8ee9nwyMEOX/EQfAixj6M73I2ihm9ELoO6fjRFvx4Yh1YU9wT1XaNaNBrietjaU         yos555+uiVzo3iZ8SjypyxjvtcBLMxN3Y4qgwKoc6DZd+rNpvO4sSyS6cCXN0+6tf5hF         5RGs2tFBKYEisnJ4oWsocTFQonDl9xUG/KcPA3/1Er+2joMmU2T0ydRTPd7CP/MDcwH/         pq7IbzY6jOhoexpEWiPx+tJMWLxhy5dfp9xVyW1lcPgj5FfCQKrdATwr5rrtOfhCpvAu         yQpw==',
      'content-id-map': {},
      'Reply-To': 'xdamman+test@gmail.com',
      subject: 'email reminder for event 1',
      'stripped-html':
        '<div dir="ltr"><span style="font-size:13px">hello world with&nbsp;</span><b style="font-size:13px">some</b><span style="font-size:13px">&nbsp;</span><i style="font-size:13px">html</i><div style="font-size:13px"><br></div><div style="font-size:13px">and some&nbsp;<a href="http://opencollective.com/" target="_blank">links</a></div><div style="font-size:13px"><br></div><div style="font-size:13px">Coo!</div></div>\n',
      from: 'Xavier Damman <xdamman+test@gmail.com>',
      sender: 'xdamman+test@gmail.com',
      'stripped-text':
        'hello world with *some* *html*\r\n\r\nand some links <http://opencollective.com/>\r\n\r\nCoo!',
      'X-Mailgun-Incoming': 'Yes',
      'X-Received':
        'by 10.37.76.196 with SMTP id z187mr11307770yba.176.1471441673982; Wed, 17 Aug 2016 06:47:53 -0700 (PDT)',
      'X-Gm-Message-State':
        'AEkoouvhAPIlNqgdreR9h0X1gAk9o8+dwYgBi+Rh+/MfQYBc3WJxRUk9FfYz2iRg+r5HUBedy/i8FMvnL81QUQ==',
      attachments: [],
      'body-html':
        '<div dir="ltr"><span style="font-size:13px">hello world with&nbsp;</span><b style="font-size:13px">some</b><span style="font-size:13px">&nbsp;</span><i style="font-size:13px">html</i><div style="font-size:13px"><br></div><div style="font-size:13px">and some&nbsp;<a href="http://opencollective.com/" target="_blank">links</a></div><div style="font-size:13px"><br></div><div style="font-size:13px">Coo!</div></div>\r\n',
      'Mime-Version': '1.0',
      Date: 'Wed, 17 Aug 2016 15:47:33 +0200',
      'Message-Id':
        '<CAFPTvg8=jZOVHseLCUZZZqCMnjkVKURatoZPufBdyf1-oj4r1g@mail.gmail.com>',
      'Content-Type':
        'multipart/alternative; boundary="001a113e78ac491d42053a44b6e5"',
      'body-plain':
        'hello world with *some* *html*\r\n\r\nand some links <http://opencollective.com/>\r\n\r\nCoo!\r\n',
      Subject: 'email reminder for event 1',
    },
    {
      server: 'nginx',
      date: 'Fri, 19 Aug 2016 16:15:41 GMT',
      'content-type': 'application/json; charset="utf-8"',
      'content-length': '5883',
      connection: 'close',
    },
  );
