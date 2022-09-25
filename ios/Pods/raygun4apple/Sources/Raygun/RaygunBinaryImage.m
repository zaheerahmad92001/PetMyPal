//
//  RaygunBinaryImage.m
//  raygun4apple
//
//  Created by raygundev on 8/3/18.
//  Copyright © 2018 Raygun Limited. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall remain in place
// in this source code.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//

#import "RaygunBinaryImage.h"

@implementation RaygunBinaryImage

- (instancetype)initWithUuId:(NSString *)uuid
                    withName:(NSString *)name
                 withCpuType:(NSNumber *)cpuType
              withCpuSubType:(NSNumber *)cpuSubType
            withImageAddress:(NSNumber *)imageAddress
               withImageSize:(NSNumber *)imageSize
{
    if ((self = [super init])) {
        _uuid         = uuid;
        _name         = name;
        _cpuType      = cpuType;
        _cpuSubtype   = cpuSubType;
        _imageAddress = imageAddress;
        _imageSize    = imageSize;
    }
    return self;
}

- (NSDictionary *)convertToDictionary {
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    
    dict[@"processor"] = [NSMutableDictionary dictionary];
    
    if (_uuid) {
        dict[@"uuid"] = _uuid;
    }
    if (_name) {
        dict[@"name"] = _name;
    }
    if (_cpuType) {
        dict[@"processor"][@"type"] = _cpuType;
    }
    if (_cpuSubtype) {
        dict[@"processor"][@"subType"] = _cpuSubtype;
    }
    if (_imageAddress) {
        dict[@"baseAddress"] = _imageAddress;
    }
    if (_imageSize) {
        dict[@"size"] = _imageSize;
    }
    
    return dict;
}

@end
