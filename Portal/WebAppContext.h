//
//  WebAppContext.h
//  Portal
//
//  Created by Allen Hsu on 7/5/13.
//  Copyright (c) 2013 Allen Hsu. All rights reserved.
//

#import <Cordova/CDVPlugin.h>
#import "LoginViewController.h"

@interface WebAppContext : CDVPlugin <LoginViewDelegate>
{
    NSString *callbackID;
}

@property(copy, nonatomic) NSString *callbackID;

- (void)dealloc;
- (void)reportSucc:(NSMutableArray*)arguments;
- (void)reportError:(NSMutableArray*)arguments;
- (void)login:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)quite:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)userCache:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)go:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)pageState:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)externApp:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)isExtAppInstalled:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)startExtApp:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end