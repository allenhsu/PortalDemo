//
//  WebAppContext.m
//  Portal
//
//  Created by Allen Hsu on 7/5/13.
//  Copyright (c) 2013 Allen Hsu. All rights reserved.
//

#import "WebAppContext.h"

@implementation WebAppContext

@synthesize callbackID;

- (void)dealloc
{
    [callbackID release];
    [super dealloc];
}

- (void)reportSucc:(NSMutableArray*)arguments
{
    
}

- (void)reportError:(NSMutableArray*)arguments
{
    
}

- (void)login:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
    LoginViewController *loginViewController = [[LoginViewController alloc] init];
    loginViewController.delegate = self;
    [self.viewController presentModalViewController:loginViewController animated:YES];
}

- (void)quite:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
    
}

- (void)userCache:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
    
}

- (void)go:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
    
}

- (void)pageState:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
    
}

- (void)externApp:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
    
}

- (void)isExtAppInstalled:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
    
}

- (void)startExtApp:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
    
}

- (void)loginViewControllerDidFinishLogin
{
    [self.viewController dismissModalViewControllerAnimated:YES];
    [self.webView stringByEvaluatingJavaScriptFromString:@"(function() { var channel = cordova.require(\"cordova/channel\"); channel.onLogin.fire(); }())"];
}

@end
